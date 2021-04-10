module.exports = (error, req, res) => {
  console.error(error)
  
  if(error.name === 'CastError') {
    res.status(400).error({ error: 'Id used is malformed'})
  }
  else {
    res.status(500).end()
  }
}