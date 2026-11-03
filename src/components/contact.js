// Kontaktformular via Formspree — vor Go-Live YOUR_FORM_ID ersetzen.
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'

export function initContact() {
  const form = document.querySelector('#contact-form')
  const messageDiv = document.querySelector('#form-message')
  if (!form) return

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const name = form.elements.name.value.trim()
    const email = form.elements.email.value.trim()
    const message = form.elements.message.value.trim()
    const gotcha = form.elements._gotcha?.value ?? ''

    // Solange Formspree nicht eingerichtet ist: auf E-Mail verweisen statt Fehlversand
    if (FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) {
      showMessage('Das Formular ist noch nicht freigeschaltet — schreib mir bitte direkt per E-Mail.', 'error', messageDiv)
      return
    }

    if (!name || !email || !message) {
      showMessage('Bitte fülle alle Felder aus.', 'error', messageDiv)
      return
    }

    const submitBtn = form.querySelector('.form-submit')
    const originalText = submitBtn.textContent
    submitBtn.disabled = true
    submitBtn.textContent = 'Wird gesendet …'

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message, _gotcha: gotcha })
      })

      if (response.ok) {
        showMessage('Danke für deine Nachricht! Ich melde mich bald.', 'success', messageDiv)
        form.reset()
      } else {
        showMessage('Das hat leider nicht geklappt. Versuch es nochmal oder schreib direkt per E-Mail.', 'error', messageDiv)
      }
    } catch {
      showMessage('Netzwerkfehler. Versuch es nochmal oder schreib direkt per E-Mail.', 'error', messageDiv)
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = originalText
    }
  })
}

function showMessage(text, type, container) {
  container.innerHTML = ''

  const msgEl = document.createElement('div')
  msgEl.className = `message ${type}`
  msgEl.textContent = text
  container.appendChild(msgEl)

  if (type === 'success') {
    setTimeout(() => msgEl.remove(), 5000)
  }
}
