type Sortable = {
  data: {
    date: Date;
    title: string;
  };
};

export function sort<T extends Sortable>(posts: T[]): T[] {
  return posts.sort((p1, p2) => {
    if (p1.data.date > p2.data.date) return -1;
    if (p1.data.date < p2.data.date) return 1;

    if (p1.data.title > p2.data.title) return -1;
    if (p1.data.title < p2.data.title) return 1;

    return 0;
  });
}
