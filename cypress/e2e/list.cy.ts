describe('Проверка листа задач', () => {

  beforeEach(() => {
    cy.visit('/');
    
    cy.get('[class*="list-header"]').find('input').as('headerInput').should('exist');
    cy.get('ul[class*="list-show"]').as('list').should('exist');
    cy.get('[class*="footer-container"]').find('[class*="footer"]').as('footer').should('exist');
    cy.get('@footer').find('div').as('middleButtonBlock').should('exist');
    cy.get('@middleButtonBlock').find('button').eq(0).as('buttonFilterAll').should('exist');
    cy.get('@middleButtonBlock').find('button').eq(1).as('buttonFilterActive').should('exist');
    cy.get('@middleButtonBlock').find('button').eq(2).as('buttonFilterCompleted').should('exist');
    cy.get('@footer').find('button').eq(4).as('buttonDelete').should('exist');
    cy.get('@footer').find('button').eq(0).as('counter').should('exist');
  });

  it('Тест добавления нового задания', () => {
    cy.get('@list').find('li').as('tasks').then(($elements) => {
      const initialCount = $elements.length;
      cy.get('@headerInput').type('Test task{enter}');
      cy.get('@tasks').should('have.length', initialCount + 1);
      cy.get('@tasks').eq(initialCount).find('input').should('have.value', 'Test task');
    });
  });

  it('Тест изменения статуса задания', () => {
    cy.get('@list').find('li').as('tasks').then(($elements) => {
      const initialCount = $elements.length;
      cy.get('@headerInput').type('Test task{enter}');
      cy.get('@tasks').eq(initialCount).find('button').as('checkbox');
      cy.get('@checkbox').should('have.attr', 'class').and('not.include', 'task-completed');
      cy.get('@checkbox').click();
      cy.get('@checkbox').should('have.attr', 'class').and('include', 'task-completed');
      cy.get('@checkbox').click();
      cy.get('@checkbox').should('have.attr', 'class').and('not.include', 'task-completed');
    });
  });

  it('Тест фильтрации', () => {
    cy.get('@list').find('li').as('tasks').then(($elements) => {
      const initialCount = $elements.length;
      cy.get('@buttonFilterActive').click();
      cy.get('@list').find('li').as('tasks').then(($elements) => {
        const initialCountActive = $elements.length;
        const initialCountCompleted = initialCount - initialCountActive;
        cy.get('@buttonFilterAll').click();

        cy.get('@headerInput').type('Test task active1{enter}');
        cy.get('@headerInput').type('Test task completed{enter}');
        cy.get('@tasks').eq(initialCount + 1).find('button').as('checkbox');
        cy.get('@checkbox').click();
        cy.get('@headerInput').type('Test task active2{enter}');

        cy.get('@tasks').should('have.length', initialCount + 3);

        cy.get('@buttonFilterActive').click();
        cy.get('@tasks').should('have.length', initialCountActive + 2);
        cy.get('@tasks').find('input[value="Test task active1"]').should('exist');
        cy.get('@tasks').find('input[value="Test task completed"]').should('not.exist');
        cy.get('@tasks').find('input[value="Test task active2"]').should('exist');

        cy.get('@buttonFilterCompleted').click();
        cy.get('@tasks').should('have.length', initialCountCompleted + 1);
        cy.get('@tasks').find('input[value="Test task active1"]').should('not.exist');
        cy.get('@tasks').find('input[value="Test task completed"]').should('exist');
        cy.get('@tasks').find('input[value="Test task active2"]').should('not.exist');

        cy.get('@buttonFilterAll').click();
        cy.get('@tasks').should('have.length', initialCount + 3);
        cy.get('@tasks').find('input[value="Test task active1"]').should('exist');
        cy.get('@tasks').find('input[value="Test task completed"]').should('exist');
        cy.get('@tasks').find('input[value="Test task active2"]').should('exist');
      });  
    });
  });

  it('Тест удаления выполненных задач', () => {
    cy.get('@list').find('li').as('tasks').then(($elements) => {
      const initialCount = $elements.length;
      cy.get('@buttonFilterCompleted').click();
      cy.get('@list').find('li').as('tasks').then(($elements) => {
        const initialCountCompleted = $elements.length;
        cy.get('@buttonFilterAll').click();

        cy.get('@headerInput').type('Test task active1{enter}');
        cy.get('@headerInput').type('Test task completed{enter}');
        cy.get('@tasks').eq(initialCount + 1).find('button').as('checkbox');
        cy.get('@checkbox').click();
        cy.get('@headerInput').type('Test task active2{enter}');

        cy.get('@buttonDelete').click();
        cy.get('@tasks').should('have.length', initialCount + 2 - initialCountCompleted);
        cy.get('@tasks').find('input[value="Test task active1"]').should('exist');
        cy.get('@tasks').find('input[value="Test task completed"]').should('not.exist');
        cy.get('@tasks').find('input[value="Test task active2"]').should('exist');
      });  
    });
  });

  it('Тест количества активных задач', () => {
    cy.get('@list').find('li').as('tasks').then(($elements) => {
      const initialCount = $elements.length;
      cy.get('@buttonFilterActive').click();
      cy.get('@list').find('li').as('tasks').then(($elements) => {
        const initialCountActive = $elements.length;
        cy.get('@buttonFilterAll').click();
        cy.get('@counter')
          .invoke('text')
          .should('satisfy', (text: string) => text.startsWith(initialCountActive.toString() + ' '));

        cy.get('@headerInput').type('Test task active1{enter}');
        cy.get('@headerInput').type('Test task completed{enter}');
        cy.get('@tasks').eq(initialCount + 1).find('button').as('checkbox');
        cy.get('@checkbox').click();
        cy.get('@headerInput').type('Test task active2{enter}');

        cy.get('@counter')
          .invoke('text')
          .should('satisfy', (text: string) => text.startsWith((initialCountActive + 2).toString() + ' '));
      });  
    });
  });
});
