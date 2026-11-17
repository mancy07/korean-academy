import { MotionConfig } from 'motion/react';
import { RouterProvider } from 'react-router-dom';
import { createAppRouter } from '@/app/router';

// Created once, outside the component, so React re-renders never rebuild it.
const router = createAppRouter();

export default function App() {
  return (
    // reducedMotion="user": if the person's device asks for less motion,
    // Motion skips movement animations everywhere in the app.
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  );
}
