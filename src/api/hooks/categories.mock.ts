import { rest } from 'msw';

import { getCategoriesPath } from './useGetCategories';

export const categoriesMockHandler = [
  rest.get(getCategoriesPath(), (_, res, ctx) => {
    return res(ctx.json(CATEGORIES_RESPONSE_DATA));
  }),
];

const CATEGORIES_RESPONSE_DATA = {
  totalElements: 2,
  totalPages: 1,
  first: true,
  last: true,
  size: 10,
  content: [
    {
      id: 2920,
      name: '생일',
      description: '감동을 높여줄 생일 선물 리스트',
      color: '#5949a3',
      imageUrl:
        'https://img1.daumcdn.net/thumb/S104x104/?fname=https%3A%2F%2Ft1.daumcdn.net%2Fgift%2Fhome%2Ftheme%2F292020231106_MXMUB.png',
    },
    {
      id: 2930,
      name: '교환권',
      description: '놓치면 후회할 교환권 특가',
      color: '#9290C3',
      imageUrl:
        'https://img1.daumcdn.net/thumb/S104x104/?fname=https%3A%2F%2Fst.kakaocdn.net%2Fproduct%2Fgift%2Fproduct%2F20240131153049_5a22b137a8d346e9beb020a7a7f4254a.jpg',
    },
  ],
  number: 0,
  sort: {
    empty: true,
    sorted: false,
    unsorted: true,
  },
  numberOfElements: 2,
  pageable: {
    pageNumber: 0,
    pageSize: 10,
    sort: {
      empty: true,
      sorted: false,
      unsorted: true,
    },
    offset: 0,
    paged: true,
    unpaged: false,
  },
  empty: false,
};