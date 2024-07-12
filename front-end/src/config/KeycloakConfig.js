import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://phamvietnhat.zapto.org:8443',
  realm: 'Pham-Viet-Nhat',
  clientId: 'e-commerce-frontend',
});

export default keycloak;
