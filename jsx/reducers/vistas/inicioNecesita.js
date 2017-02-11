export default {
    key: 'inicioNecesita',
    dependencias: ['vistaNecesita'],
    fn: (vistaNecesita) => {
        let ret = vistaNecesita.filter(item => {
            return item.haciendomateriales > 0;
        });

        return ret;
    }
}