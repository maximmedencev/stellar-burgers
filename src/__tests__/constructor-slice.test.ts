import {
  constructorSlice,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  setBun
} from '../services/slices/constructor-slice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

const ingredient1: TConstructorIngredient = {
  _id: 'test-id-1',
  id: 'unique-id-1',
  name: 'Ингредиент 1',
  type: 'main',
  price: 100,
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 150,
  image: 'test-image.png',
  image_mobile: 'test-image-mobile.png',
  image_large: 'test-image-large.png'
};

const ingredient2: TConstructorIngredient = {
  _id: 'test-id-2',
  id: 'unique-id-2',
  name: 'Ингредиент 2',
  type: 'sauce',
  price: 50,
  proteins: 5,
  fat: 2,
  carbohydrates: 10,
  calories: 75,
  image: 'test-image2.png',
  image_mobile: 'test-image2-mobile.png',
  image_large: 'test-image2-large.png'
};

const ingredient3: TConstructorIngredient = {
  _id: 'test-id-3',
  id: 'unique-id-3',
  name: 'Ингредиент 3',
  type: 'main',
  price: 75,
  proteins: 8,
  fat: 4,
  carbohydrates: 15,
  calories: 100,
  image: 'test-image3.png',
  image_mobile: 'test-image3-mobile.png',
  image_large: 'test-image3-large.png'
};

const bun1: TIngredient = {
  _id: 'bun-id-1',
  name: 'Булка 1',
  type: 'bun',
  price: 200,
  proteins: 20,
  fat: 10,
  carbohydrates: 40,
  calories: 300,
  image: 'bun-image.png',
  image_mobile: 'bun-image-mobile.png',
  image_large: 'bun-image-large.png'
};

const bun2: TIngredient = {
  _id: 'bun-id-2',
  name: 'Булка 2',
  type: 'bun',
  price: 250,
  proteins: 25,
  fat: 12,
  carbohydrates: 45,
  calories: 350,
  image: 'bun-image2.png',
  image_mobile: 'bun-image2-mobile.png',
  image_large: 'bun-image2-large.png'
};

const bun: TConstructorIngredient = {
  _id: 'bun-id',
  id: 'bun-unique-id',
  name: 'Тестовая булка',
  type: 'bun',
  price: 200,
  proteins: 20,
  fat: 10,
  carbohydrates: 40,
  calories: 300,
  image: 'bun-image.png',
  image_mobile: 'bun-image-mobile.png',
  image_large: 'bun-image-large.png'
};

describe('burgerConstructor slice', () => {
  const initialState = {
    bun: null,
    ingredients: [],
    orderRequest: false,
    orderModalData: null
  };

  describe('addIngredient', () => {
    it('добавляет ингредиент в конструктор', () => {
      const newState = constructorSlice.reducer(
        initialState,
        addIngredient(ingredient1)
      );

      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]).toEqual(ingredient1);
      expect(newState.bun).toBeNull();
    });

    it('добавляет несколько ингредиентов в конструктор', () => {
      let state = constructorSlice.reducer(
        initialState,
        addIngredient(ingredient1)
      );

      state = constructorSlice.reducer(state, addIngredient(ingredient2));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0]).toEqual(ingredient1);
      expect(state.ingredients[1]).toEqual(ingredient2);
    });

    it('не добавляет булку через addIngredient', () => {
      const newState = constructorSlice.reducer(
        initialState,
        addIngredient(bun)
      );

      expect(newState.ingredients).toHaveLength(0);
      expect(newState.ingredients).toEqual([]);
    });

    it('сохраняет существующие ингредиенты при добавлении нового', () => {
      let state = constructorSlice.reducer(
        initialState,
        addIngredient(ingredient1)
      );

      state = constructorSlice.reducer(state, addIngredient(ingredient2));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].name).toBe('Ингредиент 1');
      expect(state.ingredients[1].name).toBe('Ингредиент 2');
    });
  });

  describe('removeIngredient', () => {
    it('удаляет ингредиент из конструктора по id', () => {
      let state = constructorSlice.reducer(
        initialState,
        addIngredient(ingredient1)
      );

      state = constructorSlice.reducer(state, addIngredient(ingredient2));

      state = constructorSlice.reducer(state, removeIngredient('unique-id-1'));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(ingredient2);
    });

    it('удаляет последний ингредиент из конструктора', () => {
      let state = constructorSlice.reducer(
        initialState,
        addIngredient(ingredient1)
      );

      state = constructorSlice.reducer(state, removeIngredient('unique-id-1'));

      expect(state.ingredients).toHaveLength(0);
      expect(state.ingredients).toEqual([]);
    });

    it('не изменяет состояние, если ингредиент не найден', () => {
      let state = constructorSlice.reducer(
        initialState,
        addIngredient(ingredient1)
      );

      const prevState = { ...state };
      state = constructorSlice.reducer(
        state,
        removeIngredient('non-existent-id')
      );

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients).toEqual(prevState.ingredients);
    });
  });

  describe('moveIngredientUp', () => {
    it('перемещает ингредиент вверх на одну позицию', () => {
      let state = constructorSlice.reducer(
        initialState,
        addIngredient(ingredient1)
      );

      state = constructorSlice.reducer(state, addIngredient(ingredient2));

      state = constructorSlice.reducer(state, addIngredient(ingredient3));

      state = constructorSlice.reducer(state, moveIngredientUp(2));

      expect(state.ingredients).toHaveLength(3);
      expect(state.ingredients[0]).toEqual(ingredient1);
      expect(state.ingredients[1]).toEqual(ingredient3);
      expect(state.ingredients[2]).toEqual(ingredient2);
    });

    it('не перемещает ингредиент, если он уже на первой позиции', () => {
      let state = constructorSlice.reducer(
        initialState,
        addIngredient(ingredient1)
      );

      state = constructorSlice.reducer(state, addIngredient(ingredient2));

      const prevState = { ...state };
      state = constructorSlice.reducer(state, moveIngredientUp(0));

      expect(state.ingredients).toEqual(prevState.ingredients);
    });
  });

  describe('moveIngredientDown', () => {
    it('перемещает ингредиент вниз на одну позицию', () => {
      let state = constructorSlice.reducer(
        initialState,
        addIngredient(ingredient1)
      );

      state = constructorSlice.reducer(state, addIngredient(ingredient2));

      state = constructorSlice.reducer(state, addIngredient(ingredient3));

      state = constructorSlice.reducer(state, moveIngredientDown(0));

      expect(state.ingredients).toHaveLength(3);
      expect(state.ingredients[0]).toEqual(ingredient2);
      expect(state.ingredients[1]).toEqual(ingredient1);
      expect(state.ingredients[2]).toEqual(ingredient3);
    });

    it('не перемещает ингредиент, если он уже на последней позиции', () => {
      let state = constructorSlice.reducer(
        initialState,
        addIngredient(ingredient1)
      );

      state = constructorSlice.reducer(state, addIngredient(ingredient2));

      const prevState = { ...state };
      state = constructorSlice.reducer(state, moveIngredientDown(1));

      expect(state.ingredients).toEqual(prevState.ingredients);
    });
  });

  describe('setBun', () => {
    it('устанавливает булку в конструктор', () => {
      const newState = constructorSlice.reducer(initialState, setBun(bun1));

      expect(newState.bun).toEqual(bun1);
      expect(newState.ingredients).toHaveLength(0);
    });

    it('заменяет существующую булку на новую', () => {
      let state = constructorSlice.reducer(initialState, setBun(bun1));

      state = constructorSlice.reducer(state, setBun(bun2));

      expect(state.bun).toEqual(bun2);
      expect(state.bun).not.toEqual(bun1);
    });
  });
});
