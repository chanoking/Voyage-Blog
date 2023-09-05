export default (err, req, res, next) => {
    console.log(err); // 에러 출력

    res.status(500).json({ errorMessage: "서버 내부 에러가 발생하였습니다."})
}