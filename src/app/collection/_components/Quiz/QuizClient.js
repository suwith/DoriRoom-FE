import OX from './OX';
import Choices from './Choices';

export default function QuizClient({ quiz }) {
  const type = quiz.type;

  return <div>{type ? <OX quiz={quiz} /> : <Choices quiz={quiz} />}</div>;
}
