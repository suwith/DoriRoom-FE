import OX from './OX';
import Choices from './Choices';
import Result from './Result';

export default function QuizClient({ quiz }) {
  const type = quiz.type;

  if (type === 'result')
    return (
      <div>
        <Result quiz={quiz} />
      </div>
    );

  return <div>{type ? <OX quiz={quiz} /> : <Choices quiz={quiz} />}</div>;
}
