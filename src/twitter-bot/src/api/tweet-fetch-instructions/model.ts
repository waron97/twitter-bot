import { Document, Schema, model } from 'mongoose';

export interface IFetchInstruction {
  tweetId: string;
  fetchDate: Date;
}

export type FetchInstructionDocument = IFetchInstruction & Document;

const fetchInstructionSchema = new Schema<IFetchInstruction>({
  tweetId: {
    type: String,
    required: true,
    unique: true,
  },
  fetchDate: {
    type: Date,
    required: true,
  },
});

const FetchInstruction = model<IFetchInstruction>(
  'FetchInstruction',
  fetchInstructionSchema
);

export default FetchInstruction;
