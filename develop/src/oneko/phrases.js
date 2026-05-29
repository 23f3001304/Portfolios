/*
 * Speech-bubble copy for the oneko pet, plus a small random picker.
 *  - wakePhrases:  shown when the dog is clicked awake
 *  - factPhrases:  occasional trivia about Hemang while it follows you
 *  - statePhrases: context lines fired when it enters an idle state
 */
export const wakePhrases = [
  'ok following!',
  'i\'m up, i\'m up!',
  'huh? oh hey.',
  'where to?',
  'let\'s go',
  'right behind you',
  'on it',
  'yes boss',
  'woof',
];

export const factPhrases = [
  'fyi: he\'s lazy but productive',
  'life\'s a circle - it loops',
  'he loves Jason Bourne movies',
  'fact: he\'s 5\'9"',
  'debugging at 2am counts as cardio',
  'he studies computer science and questions reality daily',
  'dual degree = double the paperwork',
  'he fixes bugs by staring aggressively at the screen',
  'his tabs have tabs',
  'he knows the pain of sem backlog calculations',
  'coffee is basically a runtime dependency',
  'he learns DSA like it\'s a boss fight',
  'sometimes the code works and nobody knows why',
  'he opens youtube for one tutorial and emerges 3 hours later',
  'ctrl+c and ctrl+v are trusted companions',
  'he measures semesters in assignments survived',
  'his sleep schedule uses random number generation',
  'stack overflow has seen things',
  'he trusts dark mode more than humanity',
  'git commit messages become emotional near deadlines',
  'his projects start with ambition and end with hotfixes',
  'he treats warnings like decorative UI elements',
  'there is always one sem subject plotting against him',
  'he can explain neural networks but not his sleep cycle',
  'wifi speed directly affects academic confidence',
  'he survives on determination and cached notes',
  'his code may not be clean but it has character',
  'he believes every bug is a personal attack',
];

// Context-aware idle bubbles - one fires when the cat enters each state.
export const statePhrases = {
  sleeping:     ['zzz...', '*snore*', 'dreaming...', '💤'],
  tired:        ['*yawn*', 'so tired', 'mmm...'],
  scratchSelf:  ['scritch scritch', 'itchy!', '*scratch*'],
  scratchWallN: ['scratch', '*scrape*'],
  scratchWallS: ['scratch', '*scrape*'],
  scratchWallE: ['scratch', '*scrape*'],
  scratchWallW: ['scratch', '*scrape*'],
};

export function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}
