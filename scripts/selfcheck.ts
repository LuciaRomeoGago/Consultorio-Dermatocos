// npm run check — prueba la lógica de horarios y WhatsApp sin levantar el sitio.
import assert from 'node:assert/strict';
import { freeSlots, gaps, senaDe, vencido, waPhone } from '../src/lib/agenda.ts';

assert.equal(waPhone('+54 9 249 436-5460'), '5492494365460');
assert.equal(waPhone('249 436 5460'), '5492494365460');
assert.equal(waPhone('0249 4365460'), '5492494365460');
assert.equal(waPhone('54 249 4365460'), '5492494365460');

// 10:00 choca con un turno de 09:30 a 10:15; 09:00 también.
assert.deepEqual(freeSlots(['09:00', '10:00', '11:00'], 60, [{ hora: '09:30', minutos: 45 }]), ['11:00']);
assert.deepEqual(freeSlots(['09:00', '10:00'], 60, [{ hora: '10:00', minutos: 60 }]), ['09:00']);

assert.deepEqual(gaps([{ hora: '09:00', minutos: 60 }, { hora: '11:30', minutos: 30 }], 8, 12), [
  { desde: '08:00', hasta: '09:00' },
  { desde: '10:00', hasta: '11:30' },
]);
assert.deepEqual(gaps([], 8, 9), [{ desde: '08:00', hasta: '09:00' }]);

assert.equal(senaDe(60000), 15000);
assert.equal(senaDe(45000), 11250);

const t = { origen: 'web', estado: 'por_confirmar', sena_recibida: false, creado: '2026-11-04T12:00:00Z' };
const at = (min: number) => Date.parse('2026-11-04T12:00:00Z') + min * 60_000;
assert.equal(vencido(t, at(29)), false);
assert.equal(vencido(t, at(31)), true);
assert.equal(vencido({ ...t, sena_recibida: true }, at(90)), false);
assert.equal(vencido({ ...t, origen: 'admin' }, at(90)), false);
assert.equal(vencido({ ...t, estado: 'confirmado' }, at(90)), false);

console.log('selfcheck ok');
