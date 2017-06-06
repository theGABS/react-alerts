# react-alerts
Alert with queue and beautiful syntax

# Import Once in top react component (like app.js or index.js)

import { Alerts } from 'react-alerts'

```
...
render () {
  <App> 
    <Alerts />
  </App>
}
...
```

# Import when you want show alert
import Alert from 'react-alerts'

```
...
onClickHandler = () => Alert.info('It will be blue color')
...
```
