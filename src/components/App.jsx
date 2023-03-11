import css from './App.module.css';
import { Component } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button.jsx/Button';
import { FetchApi } from './FetchApi';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';

export class App extends Component {
  state = {
    searchQuery: '',
    page: 1,
    totalHits: 0,
    imageCards: [],
    loading: false,
    showModal: false,
    selectedImgCard: undefined,
  };

  componentDidUpdate(_, prevState) {
    if (
      this.state.searchQuery !== prevState.searchQuery ||
      this.state.page !== prevState.page
    ) {
      const { searchQuery, page } = this.state;

      this.setState({ loading: true, totalHits: 0 });

      const fetchResponse = FetchApi(searchQuery, page);
      fetchResponse
        .then(resp => {
          if (resp.data.hits.length === 0) {
            this.setState({ loading: false });
            toast('Oops! Find better)');
            return;
          }

          this.setState(() => ({
            imageCards: [...this.state.imageCards, ...resp.data.hits],
            totalHits: resp.data.totalHits,
          }));
        })
        .catch(error => {
          console.log(error);
          toast('Something went wrong...');
          this.setState({ loading: false });
        })
        .finally(() => this.setState({ loading: false }));
    }
  }

  onSubmit = inputValue => {
    if (this.state.searchQuery !== inputValue) {
      this.setState({ searchQuery: inputValue, imageCards: [] });
    }
  };

  onLoadBtnClick = () => {
    this.setState(({ page }) => ({
      page: page + 1,
    }));
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  onImgClick = imgId => {
    const imageCard = this.state.imageCards.find(
      imageCard => imageCard.id === imgId
    );

    this.setState({ selectedImgCard: imageCard, showModal: true });
  };

  render() {
    const { imageCards, loading, totalHits, showModal, selectedImgCard } =
      this.state;
    const { onSubmit, onLoadBtnClick, toggleModal, onImgClick } = this;

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
}
