import TextArea, {TextAreaProps} from '@components/TextArea';
import React from 'react';
import styled from 'styled-components';
interface Props extends TextAreaProps {
  onChangeText: (val: string) => void;
  notes: string;
}
const HuntingNotes: React.FC<Props> = ({onChangeText, notes, ...other}) => (
  <NoteTextArea
    {...other}
    maxLength={1000}
    onChangeText={onChangeText}
    value={notes}
  />
);

const NoteTextArea = styled(TextArea)`
  margin-left: 24px;
  margin-right: 24px;
`;

export default HuntingNotes;
