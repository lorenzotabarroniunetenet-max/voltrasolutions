// Lore Voltra ufficiale - frontend
export const GRADE_LORE = {
  Caporale: {
    rank: '🎖',
    mission: "L'Ultimo Avamposto",
    motto: 'Constantia ante omnia',
    mottoTranslation: 'La costanza prima di ogni cosa',
    codice: [
      'Eseguire con precisione il compito definito, prima di proporre alternative.',
      'Riportare al Comando ciò che si osserva, senza filtri e senza enfasi.',
      'Custodire la riservatezza del club come prima forma di lealtà.',
      'Studiare il proprio operato con onestà.',
      'Riconoscere che il proprio grado è un punto di partenza, non un limite.',
    ],
    story: 'La trincea è la sua casa. Il rumore della radio è il suo orologio.',
    color: '#B4FF39',
  },
  Sergente: {
    rank: '⭐',
    mission: 'Il Messaggero',
    motto: 'Clarius, deinde firmius',
    mottoTranslation: 'Più chiaro, poi più fermo',
    codice: [
      'Trasmettere le direttive del Comando senza alterazione, ma con interpretazione lucida.',
      'Verificare due volte ciò che si sta per riportare.',
      'Sostenere i Caporali nei momenti di pressione, mai sostituirli.',
      'Identificare i propri errori prima che venga richiesto.',
      'Conoscere ogni regola operativa, perché chi comanda deve poter rispondere.',
    ],
    story: 'Tra il fuoco e il Comando, c\'è una sola figura: il Sergente.',
    color: '#E8C84A',
  },
  Capitano: {
    rank: '🦅',
    mission: 'Le Acque Profonde',
    motto: 'Videre, deinde agere',
    mottoTranslation: 'Vedere, poi agire',
    codice: [
      'Definire l\'obiettivo prima di muoversi.',
      'Decidere nei tempi richiesti.',
      'Non delegare la responsabilità accettata.',
      'Riferire al Comando con sintesi.',
      'Riconoscere quando un\'operazione va sospesa.',
    ],
    story: 'Si muove dove nessuno vede.',
    color: '#FF8C00',
  },
  Colonnello: {
    rank: '🎗',
    mission: "L'Ultima Linea",
    motto: 'Exemplo, non verbis',
    mottoTranslation: "Con l'esempio, non con le parole",
    codice: [
      'L\'esempio personale è il primo strumento di comando.',
      'Le proprie deviazioni dalla disciplina pesano dieci volte di più.',
      'Difendere i propri Capitani in pubblico, correggerli in privato.',
      'Non utilizzare il grado per ottenere ciò che si potrebbe ottenere con la ragione.',
      'Lasciare il club in condizioni migliori di come lo si è trovato.',
    ],
    story: 'Non porta più il fucile. Non legge più i bollettini.',
    color: '#C0C0C0',
  },
}

export const BRIEFING_TYPES = {
  ordine_del_giorno: { label: 'Ordine del Giorno', icon: '📜' },
  comunicazione: { label: 'Comunicazione', icon: '📡' },
  encomio: { label: 'Encomio', icon: '🎖' },
  ricorrenza: { label: 'Ricorrenza', icon: '⚜' },
}

export function formatODG(number) {
  return `O.d.G. N. ${String(number || 1).padStart(3, '0')}`
}
