import {AppConfig} from '../config/appConfig';
import {useFetchWrapper} from './fetchWrapper';

export interface PlacePredictionResult {
  description: string;
  id: string;
}

export const usePlacesApi = () => {
  const {fetchWrapper} = useFetchWrapper();

  const autocomplete = async (
    input: string,
    signal?: AbortSignal,
  ): Promise<Array<PlacePredictionResult>> => {
    if (!input?.trim()) {
      return [];
    }
    const url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?';

    const params = new URLSearchParams();
    params.append('key', AppConfig.googlePlacesToken);
    params.append('input', input);

    const requestUri = url + params.toString();
    const result = await fetchWrapper(requestUri, {
      method: 'GET',
      signal,
    }).then((x) => x.json());

    return result?.predictions?.map((x: any) => {
      const res: PlacePredictionResult = {
        description: x.description,
        id: x.place_id,
      };
      return res;
    });
  };

  return {
    autocomplete,
  };
};
