import React, { useState } from 'react';

const categories = [
  {
    title: 'Démarches administratives',
    description: 'Suivez les étapes essentielles pour créer, modifier ou clôturer votre entreprise via le guichet unique.',
  },
  {
    title: 'Formalisme des procédures',
    description: 'Respectez les formalismes indispensables pour garantir la validité de vos démarches.',
  },
  {
    title: 'Guichet unique simplifié',
    description: 'Centralisez toutes vos formalités administratives pour gagner en efficacité.',
  },
  {
    title: 'Protection via INPI',
    description: 'Sécurisez votre identité commerciale en enregistrant vos créations auprès de l’INPI.',
  },
];

const faqs = [
  {
    question: 'Quelles sont les démarches pour créer une entreprise ?',
    answer:
      'Les démarches incluent le choix du statut, la préparation des documents, et l’immatriculation via le guichet unique.',
  },
  {
    question: 'Comment respecter le formalisme des procédures ?',
    answer:
      'Il faut veiller à la rédaction précise des documents, au respect des délais et au dépôt auprès des autorités compétentes.',
  },
  {
    question: 'Qu’est-ce que le guichet unique ?',
    answer:
      'Le guichet unique est une plateforme centralisée qui facilite la transmission de vos formalités administratives.',
  },
  {
    question: 'Pourquoi protéger ma marque avec l’INPI ?',
    answer:
      'L’INPI vous permet de sécuriser votre identité commerciale et d’éviter toute utilisation non autorisée.',
  },
];

const CentreDaide = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);

  const filteredCategories = categories.filter(
    (cat) =>
      cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFaq = (index) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  return (
    <section
      style={{
        backgroundColor: '#fff',
        color: '#000',
        padding: '2rem',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: 960,
        margin: '0 auto',
      }}
      aria-label="Centre d'Aide TOP-JURIDIQUE"
    >
      {/* En-tête */}
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: '#1e40af', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Centre d'Aide TOP-JURIDIQUE
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#333' }}>
          Toutes vos démarches et formalismes simplifiés pour la création et la gestion d’entreprise.
        </p>
        <button
          style={{
            marginTop: '1rem',
            backgroundColor: '#f4d47c',
            border: 'none',
            padding: '0.75rem 2rem',
            color: '#000',
            fontWeight: '700',
            fontSize: '1rem',
            cursor: 'pointer',
            borderRadius: 6,
            boxShadow: '0 3px 6px rgba(244, 212, 124, 0.5)',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e0c56a')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f4d47c')}
          aria-label="Commencer une démarche"
        >
          Commencer une démarche
        </button>
      </header>

      {/* Barre de recherche */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <input
          type="search"
          placeholder="Recherchez une procédure, un formalisme…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Recherche dans le centre d'aide"
          style={{
            width: '100%',
            maxWidth: 480,
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            borderRadius: 6,
            border: '2px solid #1e40af',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Cartes thématiques */}
      <section
        aria-labelledby="categories-title"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}
      >
        <h2 id="categories-title" style={{ gridColumn: '1 / -1', color: '#1e40af' }}>
          Thématiques principales
        </h2>
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat, idx) => (
            <article
              key={idx}
              style={{
                border: '1px solid #ddd',
                borderRadius: 10,
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                backgroundColor: '#fafafa',
                transition: 'transform 0.2s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              tabIndex={0}
              aria-label={`Section ${cat.title}`}
            >
              <h3 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>{cat.title}</h3>
              <p style={{ color: '#333', fontSize: '0.95rem', lineHeight: 1.4 }}>{cat.description}</p>
              <a
                href="#"
                style={{
                  marginTop: '1rem',
                  display: 'inline-block',
                  color: '#f4d47c',
                  fontWeight: '600',
                  textDecoration: 'none',
                }}
                onClick={(e) => e.preventDefault()}
                aria-label={`En savoir plus sur ${cat.title}`}
              >
                En savoir plus →
              </a>
            </article>
          ))
        ) : (
          <p style={{ gridColumn: '1 / -1', color: '#666' }}>
            Aucun résultat ne correspond à votre recherche.
          </p>
        )}
      </section>

      {/* FAQ interactive */}
      <section aria-labelledby="faq-title" style={{ marginBottom: '3rem' }}>
        <h2 id="faq-title" style={{ color: '#1e40af', marginBottom: '1rem' }}>
          Questions fréquentes
        </h2>
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                borderBottom: '1px solid #ddd',
                padding: '1rem 0',
                cursor: 'pointer',
                userSelect: 'none',
              }}
              onClick={() => toggleFaq(idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') toggleFaq(idx);
              }}
              role="button"
              tabIndex={0}
              aria-expanded={expandedFaqIndex === idx}
              aria-controls={`faq-answer-${idx}`}
              aria-labelledby={`faq-question-${idx}`}
            >
              <h3
                id={`faq-question-${idx}`}
                style={{
                  color: '#1e40af',
                  margin: 0,
                  fontSize: '1.1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {faq.question}
                <span
                  aria-hidden="true"
                  style={{
                    fontSize: '1.5rem',
                    transform: expandedFaqIndex === idx ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    color: '#f4d47c',
                  }}
                >
                  +
                </span>
              </h3>
              {expandedFaqIndex === idx && (
                <p
                  id={`faq-answer-${idx}`}
                  style={{ marginTop: '0.5rem', color: '#333', fontSize: '1rem', lineHeight: 1.5 }}
                >
                  {faq.answer}
                </p>
              )}
            </div>
          ))
        ) : (
          <p style={{ color: '#666' }}>Aucune question ne correspond à votre recherche.</p>
        )}
      </section>

      {/* Contact Support */}
      <section
        aria-labelledby="contact-title"
        style={{
          borderTop: '2px solid #1e40af',
          paddingTop: '2rem',
          marginBottom: '3rem',
          textAlign: 'center',
        }}
      >
        <h2 id="contact-title" style={{ color: '#1e40af', marginBottom: '1rem' }}>
          Contactez notre support
        </h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          Pour toute question ou assistance dans vos démarches, contactez-nous :
        </p>
        <p style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>
          📞{' '}
          <a
            href="tel:+33123456789"
            style={{ color: '#f4d47c', textDecoration: 'none', fontWeight: '600' }}
            aria-label="Téléphone du support TOP-JURIDIQUE"
          >
            +33 1 23 45 67 89
          </a>
        </p>
        <p style={{ fontSize: '1rem' }}>
          ✉️{' '}
          <a
            href="mailto:support@top-juridique.fr"
            style={{ color: '#f4d47c', textDecoration: 'none', fontWeight: '600' }}
            aria-label="Email du support TOP-JURIDIQUE"
          >
            support@top-juridique.fr
          </a>
        </p>
      </section>

      {/* Bouton d'action final */}
      <div style={{ textAlign: 'center' }}>
        <button
          style={{
            backgroundColor: '#f4d47c',
            border: 'none',
            padding: '0.85rem 2.5rem',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            cursor: 'pointer',
            borderRadius: 6,
            boxShadow: '0 4px 10px rgba(244, 212, 124, 0.6)',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e0c56a')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f4d47c')}
          aria-label="En savoir plus sur les démarches administratives"
        >
          En savoir plus
        </button>
      </div>
    </section>
  );
};

export default CentreDaide;
