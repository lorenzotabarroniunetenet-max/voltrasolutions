// Voltra — Confetti militare al raggiungimento soglia
// Usage: import { fireConfetti } from './Confetti.jsx'; fireConfetti()

export function fireConfetti() {
  const colors = ['#B4FF39', '#ffffff', '#B4FF39', '#888888']
  for (let i = 0; i < 80; i++) {
    const c = document.createElement('div')
    c.style.cssText = `
      position: fixed;
      width: ${Math.random() * 8 + 4}px;
      height: ${Math.random() * 8 + 4}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      top: 50%;
      left: 50%;
      pointer-events: none;
      z-index: 99998;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
    `
    document.body.appendChild(c)
    const angle = Math.random() * Math.PI * 2
    const velocity = Math.random() * 400 + 200
    const dx = Math.cos(angle) * velocity
    const dy = Math.sin(angle) * velocity - 200
    c.animate([
      { transform: 'translate(-50%, -50%) rotate(0deg)', opacity: 1 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${Math.random() * 720}deg)`, opacity: 0 }
    ], { duration: 1500 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => c.remove()
  }
}

export default { fireConfetti }
