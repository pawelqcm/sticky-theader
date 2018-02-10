# sticky-theader
## Make table headers sticky on scroll

### How to use:
There's just one method that makes table header stick on scroll. Pass an object with options:
``` javascript

    injectStickyTheaders({
        targetClass: 'table-custom-sticky', // selector used to target table(s)
        cssClass: 'custom-sticky', // css class to add custom styling
        appendScrollTop: true // add link to each thead that will scroll on top of the table
    });
            
```
