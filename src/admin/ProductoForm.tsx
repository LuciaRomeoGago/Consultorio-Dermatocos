import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { categories } from '../data/products';
import type { Category, Product } from '../data/types';
import { formatPrice, img, priceLabel } from '../lib/format';
import { useAdmin } from './Admin';
import { db, disponible, loadInventario, type Inventario } from './db';
import { Eliminar, storagePath } from './Productos';
import { Check, ErrorNote, Icon } from './ui';
import { errText, slugify } from './util';

type Foto = string | File | null;
const MAX_MB = 5;
const productCategories = categories.filter((c) => c !== 'Rutinas');

function useObjectUrl(f: Foto) {
  const url = useMemo(() => (f instanceof File ? URL.createObjectURL(f) : f), [f]);
  useEffect(() => () => void (f instanceof File && url && URL.revokeObjectURL(url)), [f, url]);
  return url ? (f instanceof File ? url : img(url)) : null;
}

/** Alta y edición de productos sueltos (dos fotos) y de rutinas (una foto + productos que trae). */
export function ProductoForm({ rutina: nuevaRutina }: { rutina?: boolean }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refresh } = useAdmin();
  const [inv, setInv] = useState<Inventario | null>(null);
  const editing = inv?.productos.find((p) => p.id === id);
  const rutina = editing ? editing.es_rutina : !!nuevaRutina;

  const [name, setName] = useState('');
  const [word, setWord] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<Category>('Limpieza');
  const [price, setPrice] = useState('');
  const [consultar, setConsultar] = useState(false);
  const [stock, setStock] = useState('0');
  const [stockMin, setStockMin] = useState('3');
  const [visible, setVisible] = useState(true);
  const [foto, setFoto] = useState<Foto>(null);
  const [estetica, setEstetica] = useState<Foto>(null);
  const [items, setItems] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [borrar, setBorrar] = useState(false);

  useEffect(() => {
    loadInventario().then((data) => {
      setInv(data);
      const p = data.productos.find((x) => x.id === id);
      if (!p) return;
      setName(p.name);
      setWord(p.word);
      setSubtitle(p.subtitle);
      setCategory(p.category);
      setPrice(p.price === null ? '' : String(p.price));
      setConsultar(p.price === null);
      setStock(String(p.stock));
      setStockMin(String(p.stock_min));
      setVisible(p.visible);
      setFoto(p.img);
      setEstetica(p.hover_img);
      setItems(data.rutinas.filter((r) => r.rutina_id === p.id).map((r) => r.producto_id));
    }, () => setError('No se pudo cargar el producto.'));
  }, [id]);

  const fotoUrl = useObjectUrl(foto);
  const esteticaUrl = useObjectUrl(estetica);

  if (!inv) return <div className="adm-page"><ErrorNote text={error} /></div>;
  if (id && !editing) return <div className="adm-page"><p className="adm-empty">Ese producto ya no existe. <Link to="/admin/productos">Volver a productos</Link></p></div>;

  const sueltos = inv.productos.filter((p) => !p.es_rutina && p.id !== id);
  const elegidos = sueltos.filter((p) => items.includes(p.id));
  const suma = elegidos.reduce((s, p) => s + (p.price ?? 0), 0);
  const alcanza = elegidos.length ? Math.max(0, Math.min(...elegidos.map((p) => disponible(inv, p.id)))) : 0;
  const menor = elegidos.length ? elegidos.reduce((a, b) => (disponible(inv, a.id) <= disponible(inv, b.id) ? a : b)) : null;
  const precio = consultar ? null : Number(price);

  const pick = (set: (f: Foto) => void, key: string) => (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return setErrors((e) => ({ ...e, [key]: 'Tiene que ser una foto (JPG, PNG o WebP).' }));
    if (file.size > MAX_MB * 1024 * 1024) return setErrors((e) => ({ ...e, [key]: `La foto pesa más de ${MAX_MB} MB. Achicala antes de subirla.` }));
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
    set(file);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!foto) e.foto = 'Falta la foto.';
    if (!rutina && !estetica) e.estetica = 'Falta la foto de estética.';
    if (name.trim().length < 2) e.name = 'Escribí el nombre.';
    if (!/^[a-záéíóúñü]+$/i.test(word.trim())) e.word = 'Una sola palabra, sin espacios.';
    if (!consultar && !(Number.isInteger(precio) && precio! > 0)) e.price = 'Poné el precio en pesos, sin puntos.';
    if (!rutina && !(Number.isInteger(Number(stock)) && Number(stock) >= 0)) e.stock = 'Tiene que ser un número.';
    if (!rutina && !(Number.isInteger(Number(stockMin)) && Number(stockMin) >= 0)) e.stockMin = 'Tiene que ser un número.';
    if (rutina && items.length < 2) e.items = 'Elegí al menos dos productos.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const upload = async (f: Foto, slug: string, kind: string) => {
    if (!(f instanceof File)) return f;
    const ext = f.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${slug}-${kind}-${Date.now()}.${ext}`;
    const { error } = await db.storage.from('productos').upload(path, f, { contentType: f.type });
    if (error) throw error;
    return db.storage.from('productos').getPublicUrl(path).data.publicUrl;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setError(null);
    try {
      let slug = editing?.slug ?? slugify(name);
      if (!editing) for (let n = 2; inv.productos.some((p) => p.slug === slug); n++) slug = `${slugify(name)}-${n}`;
      const imgUrl = await upload(foto, slug, 'producto');
      const hoverUrl = rutina ? null : await upload(estetica, slug, 'estetica');
      const row = {
        slug,
        name: name.trim(),
        word: word.trim().toLowerCase(),
        subtitle: subtitle.trim(),
        category: rutina ? 'Rutinas' : category,
        price: precio,
        img: imgUrl,
        hover_img: hoverUrl,
        es_rutina: rutina,
        stock: rutina ? 0 : Number(stock),
        stock_min: rutina ? 0 : Number(stockMin),
        visible,
      };
      const res = editing ? await db.from('productos').update(row).eq('id', editing.id).select('id').single() : await db.from('productos').insert(row).select('id').single();
      if (res.error) throw res.error;
      if (rutina) {
        const rid = res.data.id as string;
        const del = await db.from('rutina_items').delete().eq('rutina_id', rid);
        if (del.error) throw del.error;
        const ins = await db.from('rutina_items').insert(items.map((producto_id) => ({ rutina_id: rid, producto_id })));
        if (ins.error) throw ins.error;
      }
      // Fotos reemplazadas: se borran del bucket si se habían subido desde el panel.
      const viejas = [editing?.img !== imgUrl && storagePath(editing?.img ?? null), editing?.hover_img !== hoverUrl && storagePath(editing?.hover_img ?? null)].filter((x): x is string => !!x);
      if (viejas.length) await db.storage.from('productos').remove(viejas);
      refresh();
      navigate('/admin/productos');
    } catch (err) {
      setError(errText(err));
      setSaving(false);
    }
  };

  const preview: Product | null = fotoUrl
    ? {
        slug: 'vista-previa',
        word: word.trim().toLowerCase() || 'palabra',
        name: name || 'Nombre del producto',
        subtitle: subtitle || 'Subtítulo',
        price: consultar || !price ? null : precio,
        img: fotoUrl,
        hoverImg: esteticaUrl ?? fotoUrl,
        fullBleed: rutina,
        category: rutina ? 'Rutinas' : category,
        inStock: true,
        listed: true,
      }
    : null;

  const titulo = editing ? (rutina ? 'editar rutina' : 'editar producto') : rutina ? 'nueva rutina' : 'nuevo producto';

  return (
    <div className="adm-page">
      <header className="adm-head">
        <div>
          <Link to="/admin/productos" className="adm-back">
            <Icon name="left" size={16} /> Productos
          </Link>
          <h1 className="adm-title">{titulo}</h1>
        </div>
      </header>

      <form className="adm-editor" onSubmit={onSubmit} noValidate>
        <div className="adm-editor__form">
          <section className="adm-block">
            <h2>{rutina ? 'Foto' : 'Fotos'}</h2>
            <p className="adm-hint">{rutina ? 'Las rutinas llevan una sola foto, con los productos juntos.' : 'Cada producto lleva dos fotos: la del producto y una de estética.'}</p>
            <div className="adm-photos" data-one={rutina}>
              <PhotoInput label={rutina ? 'Foto de la rutina' : 'Foto del producto'} hint={rutina ? 'Ocupa toda la tarjeta.' : 'Fondo blanco o sin fondo. Se ve en la tarjeta.'} url={fotoUrl} fit={!rutina} onPick={pick(setFoto, 'foto')} onClear={() => setFoto(null)} error={errors.foto} />
              {!rutina && <PhotoInput label="Foto de estética" hint="Textura o aplicación sobre la piel. Aparece al pasar el mouse." url={esteticaUrl} onPick={pick(setEstetica, 'estetica')} onClear={() => setEstetica(null)} error={errors.estetica} />}
            </div>
          </section>

          <section className="adm-block">
            <h2>Datos</h2>
            <div className="adm-cols">
              <Field label="Nombre" error={errors.name}>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder={rutina ? 'Ej.: Rutina luz' : 'Ej.: Emulsión de Limpieza Suave'} />
              </Field>
              <Field label="Palabra de la tarjeta" hint="En minúscula. Va grande arriba de la foto." error={errors.word} narrow>
                <input value={word} onChange={(e) => setWord(e.target.value)} placeholder="suave" />
              </Field>
            </div>
            <Field label="Subtítulo">
              <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Ej.: Higiene facial profunda" />
            </Field>
            {!rutina && (
              <fieldset className="adm-field">
                <legend>Categoría</legend>
                <div className="chips">
                  {productCategories.map((c) => (
                    <button type="button" key={c} className="chip chip--s chip--white" aria-pressed={category === c} onClick={() => setCategory(c)}>
                      {c}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
          </section>

          {rutina && (
            <section className="adm-block">
              <h2>Productos de la rutina</h2>
              <p className="adm-hint">Al vender una rutina se descuenta uno de cada uno.</p>
              <ul className="adm-picklist">
                {sueltos.map((p) => {
                  const on = items.includes(p.id);
                  const libre = disponible(inv, p.id);
                  return (
                    <li key={p.id}>
                      <label data-on={on}>
                        <input type="checkbox" checked={on} onChange={() => setItems(on ? items.filter((x) => x !== p.id) : [...items, p.id])} />
                        <img src={img(p.img)} alt="" />
                        <span>
                          <strong>{p.name}</strong>
                          <small data-warn={libre <= 0}>{libre <= 0 ? 'Sin stock' : `${libre} en stock`}</small>
                        </span>
                        <b>{priceLabel(p.price)}</b>
                      </label>
                    </li>
                  );
                })}
              </ul>
              <ErrorNote text={errors.items ?? null} />
              {elegidos.length > 0 && (
                <dl className="adm-summary">
                  <div>
                    <dt>Suma de los {elegidos.length} productos</dt>
                    <dd>{formatPrice(suma)}</dd>
                  </div>
                  <div>
                    <dt>Alcanza para</dt>
                    <dd>{alcanza === 1 ? '1 rutina' : `${alcanza} rutinas`}</dd>
                  </div>
                  {menor && (
                    <div>
                      <dt>El que menos tiene</dt>
                      <dd>{menor.name}</dd>
                    </div>
                  )}
                </dl>
              )}
            </section>
          )}

          <section className="adm-block">
            <h2>{rutina ? 'Precio' : 'Precio y stock'}</h2>
            <div className="adm-cols adm-cols--3">
              <Field label="Precio" error={errors.price} hint={rutina && suma > 0 && precio && precio < suma ? `Ahorro para la paciente: ${formatPrice(suma - precio)} (${Math.round((1 - precio / suma) * 100)}%).` : undefined}>
                <span className="adm-prefix">
                  <span>$</span>
                  <input inputMode="numeric" value={consultar ? '' : price} disabled={consultar} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))} placeholder="0" />
                </span>
              </Field>
              {!rutina && (
                <>
                  <Field label="Stock" error={errors.stock}>
                    <input type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} />
                  </Field>
                  <Field label="Avisar con poco stock" hint="Debajo de este número aparece en Stock." error={errors.stockMin}>
                    <input type="number" min={0} value={stockMin} onChange={(e) => setStockMin(e.target.value)} />
                  </Field>
                </>
              )}
            </div>
            <Check checked={consultar} onChange={setConsultar} label="Mostrar “Consultar” en lugar del precio" sub="Para productos que se indican en consulta." />
          </section>

          <div className="adm-editor__foot">
            {editing && (
              <button type="button" className="btn btn--ghost" onClick={() => setBorrar(true)}>
                <Icon name="trash" size={18} /> Eliminar
              </button>
            )}
            <Check checked={visible} onChange={setVisible} label="Visible en la tienda" />
            <span className="adm-push" />
            <ErrorNote text={error} />
            <Link to="/admin/productos" className="btn btn--ghost">
              Cancelar
            </Link>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Guardando…' : editing ? 'Guardar cambios' : rutina ? 'Guardar rutina' : 'Guardar producto'}
            </button>
          </div>
        </div>

        <aside className="adm-editor__preview" aria-label="Vista previa">
          <p className="adm-eyebrow">Así se ve en la tienda</p>
          {preview ? (
            <div className="adm-preview">
              <ProductCard product={preview} variant="grid" />
            </div>
          ) : (
            <p className="adm-hint">Subí la foto para ver la tarjeta.</p>
          )}
          {!rutina && preview && <p className="adm-hint">Pasá el mouse por la tarjeta para ver la foto de estética.</p>}
        </aside>
      </form>

      {borrar && editing && (
        <Eliminar
          p={editing}
          inv={inv}
          onClose={() => setBorrar(false)}
          onDone={() => {
            refresh();
            navigate('/admin/productos');
          }}
        />
      )}
    </div>
  );
}

function Field({ label, hint, error, narrow, children }: { label: string; hint?: string; error?: string; narrow?: boolean; children: ReactNode }) {
  return (
    <label className="field adm-field-l" data-narrow={narrow} data-invalid={!!error}>
      <span className="adm-label">{label}</span>
      {children}
      {error ? <span className="field__error">{error}</span> : hint && <span className="adm-hint">{hint}</span>}
    </label>
  );
}

function PhotoInput({ label, hint, url, fit, onPick, onClear, error }: { label: string; hint: string; url: string | null; fit?: boolean; onPick: (f: File | undefined) => void; onClear: () => void; error?: string }) {
  return (
    <div className="adm-photo">
      <span className="adm-label">{label}</span>
      {url ? (
        <div className="adm-photo__box">
          <img src={url} alt="" data-fit={fit} />
          <div className="adm-photo__bar">
            <label className="btn btn--ghost btn--s">
              Cambiar
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => onPick(e.target.files?.[0])} />
            </label>
            <button type="button" className="adm-icon-btn adm-icon-btn--gray" onClick={onClear} aria-label={`Quitar ${label.toLowerCase()}`}>
              <Icon name="trash" size={16} />
            </button>
          </div>
        </div>
      ) : (
        <label className="adm-photo__empty" data-invalid={!!error}>
          <span className="adm-photo__icon">
            <Icon name="upload" size={22} />
          </span>
          <strong>Elegí una foto</strong>
          <small>JPG, PNG o WebP · hasta {MAX_MB} MB</small>
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => onPick(e.target.files?.[0])} />
        </label>
      )}
      {error ? <span className="field__error">{error}</span> : <span className="adm-hint">{hint}</span>}
    </div>
  );
}
