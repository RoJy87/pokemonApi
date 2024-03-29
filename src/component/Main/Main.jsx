import React, { useCallback, useEffect, useState } from 'react'
import CardList from '../../component/CardList/CardList'
import NavComponent from '../../component/NavComponent/NavComponent'
import { getAllCards, getCard } from '../../api/cardsApi'
import usePagination from '../../hooks/usePagination'
import { Button, Result, Space } from 'antd'
import { Link } from 'react-router-dom'

const Main = () => {
  const [pageNumber, limitOnPage, totalPages, prevPage, nextPage, onClickFilter, setTotalPages] = usePagination()

  const [pokemons, setPokemons] = useState([])
  const [searchPoke, setSearchPoke] = useState(pokemons)
  const [searchNotFound, setSearchNotFound] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const getAllPokemons = useCallback(
    async (limit, offset) => {
      setIsLoading(true)
      try {
        const { totalCount, pokemons } = await getAllCards(limit, offset)
        setTotalPages(Math.floor(totalCount / limit))
        setPokemons(pokemons)
        setSearchPoke(pokemons)
        setIsLoading(false)
      } catch (error) {
        console.log(error)
      }
    },
    [setTotalPages],
  )

  useEffect(() => {
    setPokemons([])
    getAllPokemons(limitOnPage, pageNumber)
  }, [pageNumber, limitOnPage, getAllPokemons])

  const onSearchHandler = useCallback(
    async (text) => {
      setSearchNotFound(false)
      try {
        if (!text) return setSearchPoke(pokemons)
        const result = await getCard(text)
        if (!result) return setSearchNotFound(true)
        setSearchPoke([result])
      } catch (error) {
        console.log(error)
      }
    },
    [pokemons],
  )

  function resetSearch() {
    setSearchNotFound(false)
    setSearchPoke(pokemons)
  }

  return (
    <>
      <NavComponent onSearchHandler={onSearchHandler} onClickFilter={onClickFilter} />
      {searchNotFound ? (
        <Result
          title='Покемон не найден, попробуйте другое имя'
          extra={
            <Button onClick={resetSearch} type='primary'>
              На главную
            </Button>
          }
        />
      ) : (
        <CardList offset={pageNumber * limitOnPage} limit={limitOnPage} pokemons={searchPoke} isLoading={isLoading} />
      )}
      {!searchNotFound && (
        <Space align='center' size='large' style={{ width: '100%', justifyContent: 'center', margin: '20px 0 0 0' }}>
          {pageNumber > 1 && (
            <Button onClick={prevPage} shape='round' size='large' loading={isLoading}>
              Назад
            </Button>
          )}
          {pageNumber < totalPages && (
            <Button onClick={nextPage} shape='round' size='large' loading={isLoading}>
              Вперед
            </Button>
          )}
        </Space>
      )}
    </>
  )
}
export default Main
