import { Document, Schema, model } from 'mongoose';

interface ITweet {
  tweetId: string;
  createdAt: Date;
  fetchedAt: Date;
  authorId: string;
  data: any;
}

const tweetSchema = new Schema<ITweet>({
  tweetId: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    required: true,
    index: true,
  },
  fetchedAt: {
    type: Date,
    default: Date.now,
  },
  authorId: {
    type: String,
    required: true,
  },
  data: {
    type: {},
  },
});

export type TweetDocument = ITweet & Document;

const Tweet = model<ITweet>('Tweet', tweetSchema);

export default Tweet;
