import OX from './OX';
import Choices from './Choices';
import Result from './Result';

export default function QuizClient({
  quiz,
  sequence,
  setSequence,
  setIsStart,
}) {
  const type = quiz?.option3 === null ? true : false;

  if (sequence === 5)
    return (
      <div>
        <Result quiz={quiz} />
      </div>
    );

  return (
    <div>
      {type ? (
        <OX quiz={quiz} setSequence={setSequence} setIsStart={setIsStart} />
      ) : (
        <Choices
          quiz={quiz}
          setSequence={setSequence}
          setIsStart={setIsStart}
        />
      )}
    </div>
  );
}
