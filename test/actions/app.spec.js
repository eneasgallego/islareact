import {cambiarContenido} from '../../src/actions/app';


describe('cambiarContenido', ()=>{
    test('debe existir', () => {
       expect(typeof cambiarContenido).toBe('function');
    });
});