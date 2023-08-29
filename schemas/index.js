import mongoose from 'mongoose';

const connect = () => {
  mongoose
    .connect(
      'mongodb+srv://chanhojin94:1234@sparta.n4taggp.mongodb.net/?retryWrites=true&w=majority',
      {
        dbName: 'board', 
      },
    )
    .then(() => console.log('MongoDB 연결에 성공하였습니다.'))
    .catch((err) => console.log(`MongoDB 연결에 실패하였습니다. ${err}`));
};

mongoose.connection.on('error', (err) => {
  console.error('MongoDB 연결 에러', err);
});

export default connect;