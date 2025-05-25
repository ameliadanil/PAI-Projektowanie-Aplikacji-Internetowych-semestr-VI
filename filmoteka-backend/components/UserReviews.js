
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserReviews = ({ userId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`/api/reviews/user/${userId}`).then((res) => {
      setReviews(res.data);
    });
  }, [userId]);

  return (
    <div>
      <h2>Twoje recenzje</h2>
      <ul>
        {reviews.map((review) => (
          <li key={review._id}>{review.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserReviews;
