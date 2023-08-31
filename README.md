# POSxpress

POSxpress is a dynamic solution built with Angular, NestJS, and Node.js, tailored for clubs gearing up to host lively events and festivals. Simplifying the process of managing food orders, POSxpress is your go-to platform for seamless order processing.

As an admin, take control of your offerings by effortlessly adding products and specifying ingredients that can be added or removed. Assign prices to your items and configure thermal printers with custom tags, ensuring efficient order management. For instance, you can designate printers to handle specific categories like food or drinks, streamlining kitchen operations.

For waitstaff, POSxpress provides a user-friendly interface to swiftly navigate tables, take orders, and make modifications such as removing ingredients or adding notes. With the ability to adjust order quantities quickly, waiters can provide efficient service while keeping track of the total price. Payment options allow for flexibility, whether customers choose to settle bills separately or collectively.

Upon payment confirmation, orders are promptly dispatched to designated printers, allowing chefs to commence food preparation without delay. POSxpress ensures a seamless flow from order placement to fulfillment, enhancing the efficiency of your event operations.

## Setup

1. Install and check if you have a running installation of docker
2. Start the docker daemon if not running `systemctl start docker`
3. Copy the `.env.tpl` to `.env` and change the values accordingly
4. Run `pnpm install`
5. Run `bash ./generate-docker.sh`
6. Change the port to what you want in `docker-compose.yaml` (currently port: 80)
7. Run `docker compose up -d`

## Developing

1. Install and check if you have a running installation of docker
2. Start the docker daemon if not running `systemctl start docker`
3. Copy the `.env.tpl` to `.env` and change the values accordingly
4. Run `pnpm install`
5. Copy the `docker-compose.override.yaml.dev` to `docker-compose.override.yaml`
6. Run `docker compose up -d
7. Start the api with `pnpm nx run posxapi:serve`
8. Start the frontend with `pnpm nx run posxrpess:serve`
9. Start developing

### ToDo

- [ ] Single select on product tags
- [ ] Produkt set tag required
- [ ] Printer tags should be multiple, unique and required
- [ ] User tag required
- [ ] When already printed you can't go back to products
- [ ] Ingredients price doesn't affect the real price
- [ ] Import an CSV file to import products
- [ ] Printing without a printer is possible -> throw error
- [ ] Maybe add a default printer to print on when there is no tag available for the order
- [ ] Waiter and product should select at least one tag

# IMPORTANT Note

This project can be improved on (features, bugs, security) but since the software is successfully deployed in production and my time to work on this is shrinking, I decided to put this project aside. Don't hesitate to use or even improve the software.