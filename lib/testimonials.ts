export type Testimonial = {
  quote: { bg: string; en: string };
  author: string;
  role: { bg: string; en: string };
};

/** Keep empty until there are real, approved testimonials. The section hides itself when empty. */
export const testimonials: Testimonial[] = [];
