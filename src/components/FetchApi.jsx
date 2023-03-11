import axios from 'axios';

export async function FetchApi(searchQuery, page) {
  const KEY = `33195419-6a100955ee108d54dc0f94ed7`;
  const BASE_URL = `https://pixabay.com/api/?q=${searchQuery}&page=${page}&key=${KEY}&image_type=photo&orientation=horizontal&per_page=12`;

  const response = await axios.get(BASE_URL);

  return response;
}
