import React from 'react';
import { Footer, Example, Section, Popover } from '../index';

const Page = ({ theme, data }) => (
  <Section>
    <Example
      title={theme.example.title}
      description={theme.example.description}
      component={theme.example.component}
      examples={theme.example.items}
    />
    <Footer repository={data.repository} article={data.article} />
    <Popover module={theme.module} />
  </Section>
);

export default Page;
