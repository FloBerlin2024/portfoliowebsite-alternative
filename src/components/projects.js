// Sample project data
const projectsData = [
  {
    id: 1,
    title: 'E-Commerce Plattform',
    description: 'Full-Stack Online-Shop mit React, Node.js und PostgreSQL. Produktkatalog, Warenkorb und Stripe-Zahlungsintegration inklusive.',
    tech: ['React', 'Node.js'],
    image: './src/assets/images/Projekt1.jpg',
    link: 'https://example.com/project1'
  },
  {
    id: 2,
    title: 'Aufgabenverwaltung',
    description: 'Kollaboratives Task-Management-Tool mit Vue.js und Firebase. Echtzeit-Updates, Benutzerauthentifizierung und Team-Funktionen.',
    tech: ['Vue.js', 'Firebase'],
    image: './src/assets/images/Projekt2.jpg',
    link: 'https://example.com/project2'
  },
  {
    id: 3,
    title: 'Analytics Dashboard',
    description: 'Datenvisualisierungs-Dashboard mit D3.js und Express.js-Backend. Echtzeit-Kennzahlen, Charts und individuelle Berichte.',
    tech: ['D3.js', 'Express'],
    image: './src/assets/images/Projekt3.jpg',
    link: 'https://example.com/project3'
  },
  {
    id: 4,
    title: 'Wetter-App',
    description: 'Progressive Web App zur Wettervorhersage. Nutzt die OpenWeather API, Service Worker für Offline-Unterstützung und responsives Design.',
    tech: ['PWA', 'API'],
    image: './src/assets/images/Projekt4.jpg',
    link: 'https://example.com/project4'
  }
]

export function initProjects() {
  const container = document.querySelector('#projects-container')

  if (!container) return

  projectsData.forEach(project => {
    const row = createProjectRow(project)
    container.appendChild(row)
  })

  console.log(`✓ Projects section initialized with ${projectsData.length} projects`)
}

function createProjectRow(project) {
  const row = document.createElement('div')
  row.className = 'featured-project'

  const tags = project.tech.map(t => `<span class="project-tag">${t}</span>`).join('')

  const placeholder = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23E0DDD8' width='800' height='600'/%3E%3Ctext x='50%25' y='50%25' font-size='18' fill='%232A2A2A' text-anchor='middle' dy='.3em' font-family='sans-serif' opacity='.4'%3EProject Image%3C/text%3E%3C/svg%3E`

  row.innerHTML = `
    <div class="featured-project-image">
      <img src="${project.image}" alt="${project.title}" onerror="this.src='${placeholder}'">
    </div>
    <div class="featured-project-text">
      <div class="project-tags">${tags}</div>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <a href="${project.link}" class="btn btn-outline" target="_blank" rel="noopener noreferrer">Projekt ansehen →</a>
    </div>
  `

  return row
}
