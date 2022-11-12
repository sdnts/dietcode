import { Post } from "./PostList";

export function Metadata({ title, date: _date, tags = [] }: Post) {
  let date = new Date(_date);
  return (
    <div className="flex items-center justify-between text-mauve-11 h-12">
      <div>
        {date.getDate()}-{date.getMonth()}-{date.getFullYear()}
      </div>

      <ul className="flex list-none space-x-2">
        {tags.map((t) => (
          <li key={t} className="">
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
