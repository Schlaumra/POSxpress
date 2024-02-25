interface link {
  name: string;
  link: string;
}

class AdminSettings {
  links: link[] = [
    { name: 'Dashboard', link: 'admin' },
    { name: 'Benutzer', link: 'admin/user' },
    { name: 'Produkte', link: 'admin/product' },
    { name: 'Drucker', link: 'admin/printer' },
  ];
}

export { AdminSettings };
