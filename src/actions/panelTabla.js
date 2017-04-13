export const DIMENSIONAR_PANELTABLA = 'DIMENSIONAR_PANELTABLA';
export const dimensionarPanelTabla = (id, alto, titulo) => ({
    type: DIMENSIONAR_PANELTABLA,
    id,
    alto,
    titulo
});
