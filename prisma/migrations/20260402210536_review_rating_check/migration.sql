-- Add CHECK constraint on Review.rating to ensure it's between 1 and 5
ALTER TABLE "Review" ADD CONSTRAINT review_rating_check CHECK (rating >= 1 AND rating <= 5);
