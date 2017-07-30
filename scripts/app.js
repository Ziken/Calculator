(function (element) {

    const calcElement        =  element;
    const enableKeyboard     =  new Keyboard(calcElement);
    const enableComputations =  new Computations();
    const enableMemory       =  new MemoryCalculator(calcElement);

    const interface = new CalculatorInterface(calcElement, {
        keyboardObj:        enableKeyboard,
        computationsObj:    enableComputations,
        memoryObj:          enableMemory
    });

})( document.querySelector('#calc') );
/*
Stworzyłbym klasę `Calculator`, która jako parametr w konstruktorze brałaby element, w którym chcemy stworzyć kalkulator.

Nie wiem, czy samego liczenia nie wywaliłbym osobno.



napisz własną klasę
- potem podziel to na przynajmniej dwie klasy: Osobno widok (renderowanie) i osobno obliczenia
- im mniejsza klasa tym lepiej
*/
