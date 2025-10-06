interface CoursePart {
  name: string;
  exerciseCount: number;
}

interface HeaderProps {
  courseName: string;
}

interface ContentProps {
  courseParts: CoursePart[];
}

interface TotalProps {
  total: number;
}

const Header = ({ courseName }: HeaderProps) => (
  <h1>{courseName}</h1>
);

const Content = ({ courseParts }: ContentProps) => (
  <>
    {courseParts.map((part, index) => (
      <p key={index}>
        {part.name} {part.exerciseCount}
      </p>
    ))}
  </>
);

const Total = ({ total }: TotalProps) => (
  <p>Number of exercises {total}</p>
);

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14
    }
  ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total total={totalExercises} />
    </div>
  );
};

export default App;