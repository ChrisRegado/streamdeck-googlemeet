/**
 * EventHandlers orchestrate our plugin logic. They wait for events to come
 * in from our Stream Deck connection and can respond however they wish.
 * They're also a good place to set up and manage any hooks you need into the
 * Meet web UI to determine when to send an update out to the Stream Deck.
 */
class SDEventHandler {

  constructor(connectionManager) {
    this._connectionManager = connectionManager;
  }

  /**
   * This method will be called for each event we receive from our Stream
   * Deck plugin. Our `message` will be an object corresponding to the
   * JSON sent by the plugin.
   *
   * Implement this in your subclass to respond to requests and button presses
   * from the Stream Deck that your SDEventHandler is interested in.
   */
  handleStreamDeckEvent = (message) => { }

  /**
   * This method will be called once during extension start-up.
   *
   * Implement this in your subclass if you need to perform any setup.
   */
  initialize = () => { }

  /**
   * This method will be called whenever we (re)establish a connection to the
   * Stream Deck plugin. It's a good place for your subclass to do any necessary
   * state synchronization.
   */
  onNewStreamDeckConnection = () => { }

}