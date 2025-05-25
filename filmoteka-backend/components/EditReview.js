
import React, { useState } from 'react';
import axios from 'axios';

const EditReview = ({ review }) => {
  const [content, setContent] = useState(review.content);

  const handleEdit = () => {
    axios.put(`/api/reviews/edit/${review._id}`, { content }).then((res) => {
      alert('Recenzja zaktualizowana');
    });
  };

  return (
    <div>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={handleEdit}>Zapisz</button>
    </div>
  );
};

export default EditReview;
