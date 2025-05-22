import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles/CityById.css';

const citiesData = [
  {
    id: 1,
    name: 'Delhi',
    image: 'https://i.ytimg.com/vi/l-5rGi8_A_4/maxresdefault.jpg',
    description: [
      'Delhi, the capital city of India, is known for its rich cultural heritage, magnificent monuments, and bustling markets.',
      'The city blends ancient traditions with modernity seamlessly, housing landmarks like the Red Fort, India Gate, and Qutub Minar.',
      'Visitors can explore vibrant streets like Chandni Chowk and savor culinary delights from street food to fine dining.'
    ]
  },
  {
    id: 2,
    name: 'Mumbai',
    image: 'https://i.ytimg.com/vi/OH4gbDXUMAQ/maxresdefault.jpg',
    description: [
      'Mumbai, often called the "City of Dreams," is the financial, commercial, and entertainment capital of India.',
      'It is home to Bollywood, bustling markets, colonial architecture, and scenic beaches like Juhu and Marine Drive.',
      'The city offers a fast-paced lifestyle while preserving its historical and cultural richness.'
    ]
  },
  {
    id: 3,
    name: 'Bengaluru',
    image: 'https://i.ytimg.com/vi/dkt8WmtkFV8/maxresdefault.jpg',
    description: [
      'Bengaluru, also known as Bangalore, is India\'s tech hub, famous for its pleasant weather and cosmopolitan culture.',
      'It boasts beautiful gardens like Lalbagh, modern malls, vibrant pubs, and a thriving startup ecosystem.',
      'The city also offers historical gems like Tipu Sultan\'s Summer Palace and Bangalore Palace.'
    ]
  },
  {
    id: 4,
    name: 'Hyderabad',
    image: 'https://i.ytimg.com/vi/EGdQ5QsHlcA/maxresdefault.jpg',
    description: [
      'Hyderabad, the "City of Pearls," is renowned for its rich history, culture, and delectable cuisine.',
      'It is home to landmarks like Charminar, Golconda Fort, and Hussain Sagar Lake.',
      'The city\'s biryani and tech parks make it a perfect blend of tradition and modernity.'
    ]
  },
  {
    id: 5,
    name: 'Chennai',
    image: 'https://i.ytimg.com/vi/mTmOIH79kI0/maxresdefault.jpg',
    description: [
      'Chennai, the gateway to South India, is famous for its beaches, temples, and classical music and dance traditions.',
      'Marina Beach, Kapaleeshwarar Temple, and Fort St. George are some must-visit attractions.',
      'The city showcases a perfect mix of traditional Tamil culture and contemporary lifestyle.'
    ]
  },
  {
    id: 6,
    name: 'Kolkata',
    image: 'https://tse2.mm.bing.net/th?id=OIP.eAd69m6r88Gd4xNikSN0mQHaDt&pid=Api&P=0&h=180',
    description: [
      'Kolkata, the "City of Joy," is known for its rich literary, artistic, and revolutionary heritage.',
      'Iconic landmarks include Victoria Memorial, Howrah Bridge, and Indian Museum.',
      'Durga Puja, vibrant street food, and warm hospitality define the spirit of Kolkata.'
    ]
  },
  {
    id: 7,
    name: 'Pune',
    image: 'https://www.movingsolutions.in/assets/images/pune-city.jpg',
    description: [
      'Pune is a vibrant city known for its academic institutions, cultural heritage, and pleasant weather.',
      'It offers attractions like Shaniwar Wada, Aga Khan Palace, and nearby hill stations like Lonavala.',
      'The youthful energy, history, and food make Pune a delightful destination.'
    ]
  },
  {
    id: 8,
    name: 'Ahmedabad',
    image: 'https://i.ytimg.com/vi/xdZFacSYPBE/maxresdefault.jpg',
    description: [
      'Ahmedabad is Gujarat\'s largest city, rich in history, culture, and architecture.',
      'Notable sites include Sabarmati Ashram, Adalaj Stepwell, and the vibrant Kankaria Lake.',
      'Its street food and colorful markets add a lively charm to the city.'
    ]
  },
  {
    id: 9,
    name: 'Jaipur',
    image: 'https://www.travelstart.co.za/blog/wp-content/uploads/2019/08/Jaipur-47.jpg',
    description: [
      'Jaipur, the "Pink City," is known for its majestic palaces, forts, and vibrant bazaars.',
      'Amber Fort, City Palace, and Hawa Mahal showcase the city\'s royal history.',
      'Rich Rajasthani culture, traditional crafts, and local cuisine are must-experiences here.'
    ]
  },
  {
    id: 10,
    name: 'Lucknow',
    image: 'https://tse4.mm.bing.net/th?id=OIP.AT1_2BJYZYYXBSFl9xZcQAHaDi&pid=Api&P=0&h=180',
    description: [
      'Lucknow, the city of Nawabs, is famous for its sophisticated manners, poetry, and delicious cuisine.',
      'Bara Imambara, Rumi Darwaza, and the vibrant Hazratganj market are must-visits.',
      'It offers a glimpse into the glorious era of Mughal and British architecture.'
    ]
  },
  {
    id: 11,
    name: 'Varanasi',
    image: 'https://tse4.mm.bing.net/th?id=OIP.QUO0NhkZIOV4UCeUMhgF7AHaFj&pid=Api&P=0&h=180',
    description: [
      'Varanasi, one of the world\'s oldest living cities, is a spiritual center situated on the banks of the Ganges.',
      'Famous for its ghats, temples, and spiritual experiences, the Ganga Aarti is a must-see spectacle.',
      'The city offers a profound glimpse into Indian traditions, spirituality, and life.'
    ]
  },
  {
    id: 12,
    name: 'Goa',
    image: 'https://i.ytimg.com/vi/u8vgfFvTcIE/maxresdefault.jpg',
    description: [
      'Goa is India\'s favorite beach destination known for its scenic beaches, nightlife, and Portuguese heritage.',
      'Famous spots include Baga Beach, Fort Aguada, and old Goa churches.',
      'Whether it\'s partying or relaxing, Goa offers a unique vibe for every traveler.'
    ]
  },
  {
    id: 13,
    name: 'Amritsar',
    image: 'https://sacredsites.com/images/asia/india/golden_temple_600.jpg',
    description: [
      'Amritsar, home to the Golden Temple, is a spiritual and cultural center of Sikhism.',
      'Witness the serene beauty of Harmandir Sahib and the patriotic fervor at Wagah Border.',
      'The city\'s food, hospitality, and history create a memorable experience.'
    ]
  },
  {
    id: 14,
    name: 'Shimla',
    image: 'https://tse3.mm.bing.net/th?id=OIP.PlNQ75jWkAaNHVY5i4Q9nQHaDj&pid=Api&P=0&h=180',
    description: [
      'Shimla, the "Queen of Hills," is a popular hill station known for its colonial architecture and scenic beauty.',
      'Attractions include Mall Road, Christ Church, and Jakhoo Temple.',
      'The pleasant climate and snowy winters make it a year-round favorite.'
    ]
  },
  {
    id: 15,
    name: 'Udaipur',
    image: 'https://tse1.mm.bing.net/th?id=OIP.3nPWZiAW9UUD8ga7MBx3YQHaEo&pid=Api&P=0&h=180',
    description: [
      'Udaipur, the "City of Lakes," is famous for its romantic charm, palaces, and lakes.',
      'City Palace, Lake Pichola, and Jag Mandir offer a glimpse into royal Rajasthan.',
      'The city\'s stunning architecture and serene lakes create an unforgettable ambiance.'
    ]
  }
];

function CityById() {
  const { id } = useParams();
  const navigate = useNavigate();

  const city = citiesData.find(c => c.id === parseInt(id));

  if (!city) {
    return <div className="text-center mt-5"><h2>City not found</h2></div>;
  }
  const handleNavigate = (path) => {
    navigate(path, { state: { city: city.name } }); 
  };
  

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4 text-light">{city.name}</h1>
      <img src={city.image} alt={city.name} className="img-fluid rounded mb-5" />

      <div className="mb-4">
        {city.description.map((para, index) => (
          <p key={index} className="lead text-light">{para}</p>
        ))}
      </div>

      <div className="d-flex justify-content-center gap-3 mt-5 flex-wrap ">
        <button className="btn btn-primary" onClick={() => handleNavigate('/destinations')}>Explore Destinations</button>
        <button className="btn btn-success" onClick={() => handleNavigate('/hotels')}>Explore Hotels</button>
        <button className="btn btn-info" onClick={() => handleNavigate('/guides')}>View Guides</button>
      </div>
    </div>
  );
}

export default CityById;
