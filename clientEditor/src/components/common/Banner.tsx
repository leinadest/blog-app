import React from 'react';
import styles from './Banner.module.css';

interface BannerProps {
  heading: string;
  paragraph: string;
  children: React.ReactNode;
}

export default function Banner({ heading, paragraph, children }: BannerProps) {
  return (
    <section className={styles.section}>
      <h2>{heading}</h2>
      <p>{paragraph}</p>
      {children}
    </section>
  );
}
