import css from './App.module.css';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button.jsx/Button';
import { FetchApi } from './FetchApi';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';

export function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalHits, setTotalhits] = useState(0);
  const [imageCards, setImageCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImgCard, setSelectedImgCard] = useState(undefined);

  const onSubmit = inputValue => {
    if (searchQuery !== inputValue) {
      setSearchQuery(inputValue);
      setImageCards([]);
    }
  };
  const onLoadBtnClick = () => {
    setPage(page => page + 1);
  };

  const toggleModal = () => {
    setShowModal(showModal => !showModal);
  };

  const onImgClick = imgId => {
    const imageCard = imageCards.find(imageCard => imageCard.id === imgId);
    setSelectedImgCard(imageCard);
    setShowModal(true);
  };

  useEffect(() => {
    if (!searchQuery) {
      return;
    }
    setLoading(true);
    setTotalhits(0);

    FetchApi(searchQuery, page)
      .then(resp => {
        if (resp.data.hits.length === 0) {
          setLoading(false);
          toast('Oops! Find better)');
          return;
        }
        setImageCards(prevImageCards => [...prevImageCards, ...resp.data.hits]);
        setTotalhits(resp.data.totalHits);
      })
      .catch(error => {
        console.log(error);
        toast('Something went wrong...');
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, [page, searchQuery]);

  return (
    <div className={css.App}>
      <Searchbar onSubmit={onSubmit} />

      {imageCards.length > 0 && (
        <ImageGallery imageCardsArray={imageCards} onImgClick={onImgClick} />
      )}

      {showModal && (
        <Modal onClose={toggleModal} selectedImgCard={selectedImgCard} />
      )}

      {loading && <Loader />}

      {totalHits > 12 && <Button onClick={onLoadBtnClick} />}

      <ToastContainer position="top-center" autoClose={3000} theme="light" />
    </div>
  );
}
