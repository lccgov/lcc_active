<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 xmlns:s="http://schemas.datacontract.org/2004/07/LCC.Events.DTO" exclude-result-prefixes="s"
 xmlns:d2pl="http://schemas.microsoft.com/2003/10/Serialization/Arrays"
 xmlns:ms="urn:schemas-microsoft-com:xslt">
  <xsl:output method="html" version="4.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <div class="row">
      <div class="col-lg-12">
        <hr class="spacerTop" />
        <div>
          <xsl:if test="s:EventDetailsModel/s:Expired = 'true'">
            <div class="alert alert-warning">
              <p>
                There are no future dates available for this event. Please <a href='/'>click</a> to go to home page.
              </p>
            </div>
          </xsl:if>
        </div>
        <h1>
          <xsl:value-of select="s:EventDetailsModel/s:Title"/>
        </h1>
        <!-- Go to www.addthis.com/dashboard to customize your tools -->
        <div class="addthis_sharing_toolbox"></div>
      </div>
      <div class="col-md-8">
        <div class="mainContentArticle">
          <xsl:if test="s:EventDetailsModel/s:ImageUrl != ''">
            <img class="eventImage" src="{s:EventDetailsModel/s:ImageUrl}" alt="{s:EventDetailsModel/s:Title}" />
          </xsl:if>
          <xsl:value-of select="s:EventDetailsModel/s:Description" disable-output-escaping="yes"/>
          <div class="clear"></div>
        </div>
        <!-- End MainContentArticle -->
        <div class="dateBox">
          <h2><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span>When?</h2>
          <ul class="date-list">
            <xsl:for-each select="s:EventDetailsModel/s:Occurrences/s:OccurrenceModel">
              <li>
                <xsl:if test="s:Cancelled = 'true'">
                    <xsl:attribute name="class">session cancelled</xsl:attribute>
                </xsl:if>
                <h2>
                  <span>
                    <xsl:value-of select="ms:format-date(s:Start,'dddd')" />
                  </span>
                  <xsl:value-of select="ms:format-date(s:Start,'d/MM/yyyy')"/>
                </h2>
                <p>
                  <xsl:value-of select="ms:format-date(s:Start,'ddd d/MM/yyyy')"/>&#160;
                  <xsl:value-of select="ms:format-time(s:Start,'h:mm tt')"/>
                  <span>to</span>
                  <xsl:value-of select="ms:format-date(s:End,'ddd d/MM/yyyy')"/>&#160;
                  <xsl:value-of select="ms:format-time(s:End,'h:mm tt')"/>
                </p>
                <xsl:if test="s:Cancelled = 'true'">
                  <p class="cancelled">Cancelled</p>
                </xsl:if>
              </li>
            </xsl:for-each>
          </ul>
        </div>
        <xsl:if test="s:EventDetailsModel/s:Tickets != ''">
         <div class="contentBoxBorder">
          <h2><span class="glyphicon glyphicon-credit-card" aria-hidden="true"></span>Ticket Information:</h2>
          <div class="innerContentBox">
            <table class="basicTable">
              <tr>
                <th>Ticket Name</th>
                <th>Price</th>
              </tr>
              <xsl:for-each select="s:EventDetailsModel/s:Tickets/s:TicketModel">
                <tr>
                  <td>
                    <xsl:value-of select="s:Name" />
                  </td>
                  <td>
                    <xsl:choose>
                      <xsl:when test="s:Cost &gt; 0">
                        £<xsl:value-of select="format-number(s:Cost, '#,##0.00')" />
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:choose>
                          <xsl:when test="s:TicketRequired = 'true'">
                            FREE (ticket required)
                          </xsl:when>
                          <xsl:otherwise>
                            FREE
                          </xsl:otherwise>
                        </xsl:choose>
                      </xsl:otherwise>
                    </xsl:choose>
                  </td>
                </tr>
              </xsl:for-each>
            </table>
          </div>
          </div>
        </xsl:if>
            <div class="row">
        <xsl:if test="s:EventDetailsModel/s:AgeRanges != ''">

            <div>
              <xsl:choose>
                <xsl:when test="s:EventDetailsModel/s:AccessibilityIndicators = ''">
                  <xsl:attribute name="class">col-sm-12</xsl:attribute>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:attribute name="class">col-sm-6</xsl:attribute>
                </xsl:otherwise>
              </xsl:choose>
              <div class="contentBoxBorder">
                <h2><span class="glyphicon glyphicon-user" aria-hidden="true"></span>Age Ranges</h2>
                <div class="innerContentBox">
                  <ul>
                    <xsl:for-each select="s:EventDetailsModel/s:AgeRanges/d2pl:string">
                      <li>
                        <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                        <xsl:value-of select="."/>
                      </li>
                    </xsl:for-each>
                  </ul>
                </div>
              </div>
            </div>

        </xsl:if>
        <xsl:if test="s:EventDetailsModel/s:AccessibilityIndicators != ''">
            <div>
              <xsl:choose>
                <xsl:when test="s:EventDetailsModel/s:AgeRanges = ''">
                  <xsl:attribute name="class">col-sm-12</xsl:attribute>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:attribute name="class">col-sm-6</xsl:attribute>
                </xsl:otherwise>
              </xsl:choose>
              <div class="contentBoxBorder">
                <h2><span class="glyphicon glyphicon-user" aria-hidden="true"></span>Accessibility indicators</h2>
                <div class="innerContentBox">
                  <ul>
                  <xsl:for-each select="s:EventDetailsModel/s:AccessibilityIndicators/d2pl:string">
                    <li>
                      <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                      <xsl:value-of select="."/>
                    </li>
                  </xsl:for-each>
                   </ul> 
                </div>
              </div>
            </div>

        </xsl:if>
        </div>
      <hr class="spacerBottom" />
      </div>

    <div class="col-md-4">
      <div class="eventDetails eventDetailsBlock eventVenue">
        <h4><span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span>Venue</h4>
        <span class="eventDetailsBlockIcon eventDetailsBlockIconVenue"></span>
        <div id="googleMap" data-module="google-map" data-map-zoom="15" data-map-lat="53.798666300000010000" data-map-lng="-1.535628399999950500"></div>
        <p>
          <strong>
            <xsl:value-of select="s:EventDetailsModel/s:Venue/s:Name"/>
          </strong>
          <br />
          <xsl:value-of select="s:EventDetailsModel/s:Venue/s:Address/s:AddressLine1"/>
          <br/>
          <xsl:if test="s:EventDetailsModel/s:Venue/s:Address/s:AddressLine2 != ''">
            <xsl:value-of select="s:EventDetailsModel/s:Venue/s:Address/s:AddressLine2"/>
            <br/>
          </xsl:if>
          <xsl:if test="s:EventDetailsModel/s:Venue/s:Address/s:AddressLine3 != ''">
            <xsl:value-of select="s:EventDetailsModel/s:Venue/s:Address/s:AddressLine3"/>
            <br/>
          </xsl:if>
          <xsl:if test="s:EventDetailsModel/s:Venue/s:Address/s:City != ''">
            <xsl:value-of select="s:EventDetailsModel/s:Venue/s:Address/s:City"/>
            <br/>
          </xsl:if>
          <xsl:value-of select="s:EventDetailsModel/s:Venue/s:Address/s:Postcode"/>
          <br/>
          <input id="latitude" type="hidden" value="{s:EventDetailsModel/s:Venue/s:Address/s:Latitude}" />
          <input id="longitude" type="hidden" value="{s:EventDetailsModel/s:Venue/s:Address/s:Longitude}" />
        </p>
        <p>
          <xsl:value-of select="s:EventDetailsModel/s:Venue/s:BusinessPhone"/>
        </p>
      </div>
      <xsl:if test="s:EventDetailsModel/s:ContactName != '' or s:EventDetailsModel/s:ContactEmail != '' or s:EventDetailsModel/s:ContactEmail != ''">
        <div class="contentBoxBorder">
          <h2><span class="glyphicon glyphicon-earphone" aria-hidden="true"></span>Contact details</h2>
          <div class="innerContentBox">
            <xsl:if test="s:EventDetailsModel/s:ContactName">
              <div class="display-field">
                <xsl:value-of select="s:EventDetailsModel/s:ContactName"/>
              </div>
            </xsl:if>
            <xsl:if test="s:EventDetailsModel/s:ContactEmail">
              <div class="display-field">
                <a href="mailto:{s:EventDetailsModel/s:ContactEmail}">
                  <xsl:value-of select="s:EventDetailsModel/s:ContactEmail"/>
                </a>
              </div>
            </xsl:if>
            <xsl:if test="s:EventDetailsModel/s:ContactTelephone">
              <div class="display-field">
                <xsl:value-of select="s:EventDetailsModel/s:ContactTelephone"/>
              </div>
            </xsl:if>
          </div>
        </div> 
      </xsl:if>
    </div>
    </div>
    <script type="text/javascript">
      <!--jQuery(document).ready(function () {
      jQuery('ul.date-list').each(function () {
      var LiN = jQuery(this).find('li').length;
      if (LiN > 3) {
      jQuery('li', this).eq(2).nextAll().hide().addClass('toggleable');
      jQuery(this).append('<a class="plusMinus">Show more</a>');
      }
      });
      jQuery('ul.date-list').on('click', '.plusMinus', function () {
      if (jQuery(this).hasClass('active')) {
      jQuery(this).text('Show more').removeClass('active');
      } else {
      jQuery(this).text('Show less').addClass('active');
      }
      jQuery(this).siblings('li.toggleable').slideToggle();
      });
      });-->
    </script>
  </xsl:template>
</xsl:stylesheet>
