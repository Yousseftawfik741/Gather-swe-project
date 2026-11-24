
import './EventCategories.css';

const categories = [
  {
    id: 1,
    title: 'Weddings',
    description: 'Create the wedding celebration you have always imagined.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85',
    label: 'Love & Elegance'
  },
  {
    id: 2,
    title: 'Birthdays',
    description: 'Make every birthday a moment worth remembering.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=85',
    label: 'Celebrate Life'
  },
  {
    id: 3,
    title: 'Parties & Celebrations',
    description: 'Bring people together for unforgettable moments.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=85',
    label: 'Make It Special'
  },
  {
    id: 4,
    title: 'Corporate Events',
    description: 'Create professional events that leave a lasting impression.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=85',
    label: 'Business & Beyond'
  },
  {
    id: 5,
    title: 'Live Entertainment',
    description: 'Discover concerts, singers, comedy and live performances.',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=85',
    label: 'Feel The Moment'
  }
];

function EventCategories() {
  return (
    <section className="event-categories" id="events">
      <div className="categories-heading">
        <span className="categories-eyebrow">EXPLORE GATHER</span>

        <h2>
          Find the perfect event
          <br />
          for <span>every occasion.</span>
        </h2>

        <p>
          Whatever you're celebrating, find inspiration
          and everything you need to make it special.
        </p>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <article className="category-card" key={category.id}>
            <div className="category-image">
              <img src={category.image} alt={category.title} />
              <div className="category-image-overlay"></div>
              <span className="category-label">{category.label}</span>
            </div>

            <div className="category-info">
              <div className="category-text">
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </div>

              <span className="category-arrow">↗</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default EventCategories;
