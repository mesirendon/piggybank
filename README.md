# PiggyBank
Repositorio de ejemplo de cómo crear un contrato inteligente para el caso de uso Alcancia

Clone el repositorio

```bash
$ git clone git@github.com:mesirendon/piggybank.git
```

## Usar este repo
Se recomienda tener instaladas las dependencias para seguir con los nuevos pasos.

### Dependencias
Para verificar los casos de pruebas garantice tener instalado globalmente estos paquetes: `ganache-cli` y `truffle`.

```bash
$ npm i -g ganache-cli truffle @vue/cli
```

De forma local es necesario cargar las dependencias.

```bash
$ npm i
```

### Probar los contratos inteligentes
Es necesario tener una cadena de bloques virtual corriendo, en una consola ejecute `ganache-cli`.

```bash
$ ganache-cli
```

Para correr las pruebas en otra consola ejecute:

```bash
$ truffle test
```

Una vez las pruebas pasen, se puede cancelar ganache.

### Probando la ÐApp de forma local.

En una consola se debe inicializar ganache.

```bash
$ ganache-cli
```

En otra consola es necesario compilar los contratos inteligentes y luego migrarlos.

```bash
$ truffle compile
$ truffle migrate
```

En la última ejecución de migración debe aparecer la dirección del contrato `Hub` migrado.

Como en el ejemplo:

```bash
2_hub_migration.js
==================

   Deploying 'Hub'
   ---------------
   > transaction hash:    0xa82eb30fcf8f2174adf0b5b27fc2af52360b308507019162dc63b81cb7d42c1a
   > Blocks: 0            Seconds: 0
   > contract address:    0xCfEB869F69431e42cdB54A4F4f105C19C080A601 // <- Hay que copiar esta dirección
   > block number:        3
   > block timestamp:     1597448191
   > account:             0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1
   > balance:             99.98568156
   > gas used:            481653 (0x75975)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00963306 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00963306 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.01347168 ETH

```

La dirección que se acaba de copiar se debe pegar en el archivo `src/main.js` en la línea 13:

```javascript
Vue.prototype.$hub = Vue.hub = new Hub('0xCfEB869F69431e42cdB54A4F4f105C19C080A601');
```

Cuando ganache inicializó, 10 llaves privadas fueron expuestas. Estas se pueden importar en Metamask para jugar con la ÐApp.
