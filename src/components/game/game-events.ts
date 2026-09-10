/**
 * Eventos del minijuego, en su propio módulo para que quien lo abre
 * (home, modal de contacto, briefing) no arrastre el código del juego.
 */

export const GAME_EVENT = "setnou:open-game";

/** De dónde viene el jugador: cambia el copy del cierre. */
export type ContextoJuego = "frio" | "post-envio";

/** Abre el minijuego desde cualquier componente cliente. */
export function openGameModal(contexto: ContextoJuego = "frio") {
  window.dispatchEvent(new CustomEvent(GAME_EVENT, { detail: { contexto } }));
}
