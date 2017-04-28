import { expect } from 'chai';
import { cambiarContenido } from '../../src/actions/app';


describe('cambiarContenido', ()=>{
    it('debe existir', ()=>{
        expect(cambiarContenido).to.be.a('function');
    })
})