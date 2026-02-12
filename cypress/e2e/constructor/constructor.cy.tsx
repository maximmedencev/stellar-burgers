import ingredientsData from '../../fixtures/ingredients.json';
import orderData from '../../fixtures/order.json';

describe('Добавление ингредиента из списка в конструктор', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      statusCode: 200,
      body: ingredientsData
    }).as('getIngredients');
    cy.visit('http://localhost:4000');
  });

  it('добавляем булки в конструктор', () => {
    cy.contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();
    cy.contains('Краторная булка N-200i (верх)').should('exist');
    cy.contains('Краторная булка N-200i (низ)').should('exist');
  });

  it('добавляем начинки в конструктор', () => {
    cy.contains('Филе Люминесцентного тетраодонтимформа')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    cy.get('.constructor-element')
      .contains('Филе Люминесцентного тетраодонтимформа')
      .should('exist');

    cy.contains('Мясо бессмертных моллюсков Protostomia')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    cy.get('.constructor-element')
      .contains('Мясо бессмертных моллюсков Protostomia')
      .should('exist');

    cy.contains('Мини-салат Экзо-Плантаго')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    cy.get('.constructor-element')
      .contains('Мини-салат Экзо-Плантаго')
      .should('exist');
  });

  it('добавляем соусы в конструктор', () => {
    cy.contains('Соус Spicy-X')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    cy.get('.constructor-element').contains('Соус Spicy-X').should('exist');

    cy.contains('Соус фирменный Space Sauce')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    cy.get('.constructor-element')
      .contains('Соус фирменный Space Sauce')
      .should('exist');

    cy.contains('Соус традиционный галактический')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    cy.get('.constructor-element')
      .contains('Соус традиционный галактический')
      .should('exist');
  });
});

describe('Работа модальных окон', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      statusCode: 200,
      body: ingredientsData
    }).as('getIngredients');
    cy.visit('http://localhost:4000');
  });

  it('Работа модального окна с закрытием на щелчком кнопке', () => {
    cy.contains('Краторная булка N-200i').click();
    cy.contains('Детали ингредиента')
      .parent()
      .siblings()
      .contains('Краторная булка N-200i')
      .should('be.visible');

    cy.contains('Детали ингредиента').parent().parent().find('button').click();
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('Работа модального окна с закрытием на оверлей', () => {
    cy.contains('Краторная булка N-200i').click();
    cy.contains('Детали ингредиента')
      .parent()
      .siblings()
      .contains('Краторная булка N-200i')
      .should('be.visible');

    cy.contains('Детали ингредиента')
      .parent()
      .parent()
      .siblings()
      .first()
      .click({ force: true });
    cy.contains('Детали ингредиента').should('not.exist');
  });
});

describe('Создание заказа', () => {
  const mockOrderResponse = orderData;

  const mockTokens = {
    accessToken: 'mock-token-123',
    refreshToken: 'refresh-token-12345'
  };

  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: orderData.order.owner
      }
    }).as('getUser');

    cy.intercept('POST', '**/api/orders', {
      statusCode: 200,
      body: mockOrderResponse
    }).as('createOrder');

    cy.setCookie('accessToken', mockTokens.accessToken);
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', mockTokens.refreshToken);
    });

    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
  });

  it('создаёт заказ и очищает конструктор', () => {
    cy.setCookie('accessToken', mockTokens.accessToken);

    cy.contains(mockOrderResponse.order.ingredients[0].name)
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    cy.contains(mockOrderResponse.order.ingredients[1].name)
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    cy.contains(mockOrderResponse.order.ingredients[2].name)
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    cy.contains(mockOrderResponse.order.ingredients[0].name + ' (верх)').should(
      'exist'
    );
    cy.contains(mockOrderResponse.order.ingredients[3].name + ' (низ)').should(
      'exist'
    );

    cy.get('.constructor-element')
      .contains(mockOrderResponse.order.ingredients[0].name)
      .should('exist');

    cy.get('.constructor-element')
      .contains(mockOrderResponse.order.ingredients[1].name)
      .should('exist');

    cy.get('.constructor-element')
      .contains(mockOrderResponse.order.ingredients[2].name)
      .should('exist');

    cy.contains('Оформить заказ').should('be.visible').click();

    cy.wait('@createOrder').then((interception) => {
      expect(interception.response!.statusCode).to.eq(200);
      expect(interception.response!.body.success).to.be.true;
      expect(interception.response!.body.order.number).to.eq(
        orderData.order.number
      );
      expect(interception.response!.body.order.price).to.eq(
        orderData.order.price
      );
    });

    cy.contains(mockOrderResponse.order.number)
      .parent()
      .parent()
      .should('be.visible');

    cy.contains(mockOrderResponse.order.number)
      .parent()
      .parent()
      .find('button')
      .click();
    cy.contains(mockOrderResponse.order.number).should('not.exist');

    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
    cy.contains(mockOrderResponse.order.ingredients[0] + ' (верх)').should(
      'not.exist'
    );
    cy.contains(mockOrderResponse.order.ingredients[3] + ' (низ)').should(
      'not.exist'
    );

    cy.get('.constructor-element').should('not.exist');
  });
});
