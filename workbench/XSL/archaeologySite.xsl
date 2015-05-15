<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" 
xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
xmlns:mods="http://www.loc.gov/mods/v3" 
xmlns:fits="http://hul.harvard.edu/ois/xml/ns/fits/fits_output" 
xmlns:cpf="urn:isbn:1-931666-33-4" 
>

<xsl:template match="/">
  <html>
  <body>
  <dl class="metadata-table">
      <xsl:for-each select="xml_root/debug">
    <dt>Debug</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:for-each>
    <xsl:for-each select="//citeinfo/title">
    <xsl:if test="current()!=''">
    <dt>Site Title</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//descript/abstract">
    <xsl:if test="current()!=''">
    <dt>Abstract</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//descript/purpose">
          <xsl:if test="current()!=''">
              <dt>Purpose</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//descript/supplinf">
    <xsl:if test="current()!=''">
    <dt>Supplemental Information</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//timeperd/current">
          <xsl:if test="current()!=''">
              <dt>Currentness Reference</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
     </xsl:for-each>
     <xsl:for-each select="//status/progress">
          <xsl:if test="current()!=''">
              <dt>Progress</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
     </xsl:for-each>
     <xsl:for-each select="//status/update">
          <xsl:if test="current()!=''">
              <dt>Maintenance and Update Frequency</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
     </xsl:for-each>
      <xsl:for-each select="//spdom/bounding/westbc">
          <xsl:if test="current()!=''">
              <dt>West Bounding Coordinate</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//spdom/bounding/eastbc">
          <xsl:if test="current()!=''">
              <dt>East Bounding Coordinate</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//spdom/bounding/northbc">
          <xsl:if test="current()!=''">
              <dt>North Bounding Coordinate</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//spdom/bounding/southbc">
          <xsl:if test="current()!=''">
              <dt>South Bounding Coordinate</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
        
      <xsl:for-each select="//idinfo/accconst">
          <xsl:if test="current()!=''">
              <dt>Access Constraints</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//idinfo/useconst">
          <xsl:if test="current()!=''">
              <dt>Use Constraints</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>      
      <xsl:for-each select="//idinfo/datacred">
          <xsl:if test="current()!=''">
              <dt>Data Set Credit</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//idinfo/secinfo/secsys">
          <xsl:if test="current()!=''">
              <dt>Security Classification System</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>       
      <xsl:for-each select="//idinfo/secinfo/secclass">
          <xsl:if test="current()!=''">
              <dt>Security Classification</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>       
      <xsl:for-each select="//idinfo/secinfo/sechandl">
          <xsl:if test="current()!=''">
              <dt>Security Handling Description</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>   
      <xsl:for-each select="//idinfo/native">
          <xsl:if test="current()!=''">
              <dt>Native Data Set Environment</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each> 
      
      <xsl:for-each select="//keywords">
          <xsl:for-each select="theme">        
              <xsl:for-each select="themekt">
                  <xsl:if test="current()!=''">
                      <dt>Theme Keyword Thesaurus</dt><dd><xsl:value-of select="current()"/></dd>
                  </xsl:if>
              </xsl:for-each>
              <xsl:for-each select="themekey">
                  <xsl:if test="current()!=''">
                      <dt>Theme Keyword</dt><dd><xsl:value-of select="current()"/></dd>
                  </xsl:if>
              </xsl:for-each>
          </xsl:for-each>
          <xsl:for-each select="place">
              <xsl:for-each select="placekt">
                  <xsl:if test="current()!=''">
                      <dt>Place Keyword Thesaurus</dt><dd><xsl:value-of select="current()"/></dd>
                  </xsl:if>
              </xsl:for-each>
              <xsl:for-each select="placekey">
                  <xsl:if test="current()!=''">
                      <dt>Place Keyword</dt><dd><xsl:value-of select="current()"/></dd>
                  </xsl:if>
              </xsl:for-each>
          </xsl:for-each>
          <xsl:for-each select="stratum">
              <xsl:for-each select="stratkt">
                  <xsl:if test="current()!=''">
                      <dt>Stratum Keyword Thesaurus</dt><dd><xsl:value-of select="current()"/></dd>
                  </xsl:if>
              </xsl:for-each>
              <xsl:for-each select="stratkey">
                  <xsl:if test="current()!=''">
                      <dt>Stratum Keyword</dt><dd><xsl:value-of select="current()"/></dd>
                  </xsl:if>
              </xsl:for-each>
          </xsl:for-each>
          <xsl:for-each select="temporal">
              <xsl:for-each select="tempkt">
                  <xsl:if test="current()!=''">
                      <dt>Temporal Keyword Thesaurus</dt><dd><xsl:value-of select="current()"/></dd>
                  </xsl:if>
              </xsl:for-each>
              <xsl:for-each select="tempkey">
                  <xsl:if test="current()!=''">
                      <dt>Temporal Keyword</dt><dd><xsl:value-of select="current()"/></dd>
                  </xsl:if>
              </xsl:for-each>
          </xsl:for-each>
      </xsl:for-each>
      <xsl:for-each select="//keywtax">      
          <xsl:for-each select="taxonkey">
              <xsl:if test="current()!=''">
                  <dt>Taxonomic Keyword</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>
      </xsl:for-each>
      
      <xsl:for-each select="//taxonomy/taxonsys/taxonpro">
          <xsl:if test="current()!=''">
              <dt>Taxonomic Procedures</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//taxonomy/taxonsys/taxoncom">
          <xsl:if test="current()!=''">
              <dt>Taxonomic Completeness</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
          <xsl:for-each select="//taxonomy/taxonsys/taxoncom2">
              <xsl:if test="current()!=''">
                  <dt>Taxonomic Completeness 2</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
      </xsl:for-each>      
     
          <xsl:for-each select="//taxoncl">
              <xsl:if test="current()!=''">
                  <dt>Taxonomic Classification</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>
          <xsl:for-each select="//taxongen">
              <xsl:if test="current()!=''">
                  <dt>General Taxonomic Coverage</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>

      
      <xsl:for-each select="//dataqual/attracc/attracc">
          <xsl:if test="current()!=''">
              <dt>Attribute Accuracy </dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>      
      <xsl:for-each select="//dataqual/logic">
          <xsl:if test="current()!=''">
              <dt>Logical Consistency Report</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>      
      <xsl:for-each select="//dataqual/complete">
          <xsl:if test="current()!=''">
              <dt>Completeness Report</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>      
      <xsl:for-each select="//dataqual/posacc/horizpa/horizpar">
          <xsl:if test="current()!=''">
              <dt>Horizontal Positional Accuracy Report</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>      
      <xsl:for-each select="//dataqual/posacc/vertacc/vertaccr">
          <xsl:if test="current()!=''">
              <dt>Vertical Positional Accuracy Report</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
       <xsl:for-each select="//method/methtype">
              <xsl:if test="current()!=''">
                  <dt>Methodology Type</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
       </xsl:for-each>          
       <xsl:for-each select="//method/methtype/methodid/methkt">
              <xsl:if test="current()!=''">
                  <dt>Method Keyword Thesaurus</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
       </xsl:for-each>
       <xsl:for-each select="//method/methtype/methodid/methkey">
              <xsl:if test="current()!=''">
                  <dt>Methodology Keyword</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
       </xsl:for-each>
       <xsl:for-each select="//method/methdesc">
              <xsl:if test="current()!=''">
                  <dt>Methodology Description</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
       </xsl:for-each>
          <xsl:for-each select="//method/methcite">
              <xsl:if test="current()!=''">
                  <dt>Methodology Citation</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>
      <xsl:for-each select="//dataqual/lineage/procstep/procdesc">
          <xsl:if test="current()!=''">
              <dt>Process Description</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//dataqual/lineage/procstep/procdesc/procdate">
          <xsl:if test="current()!=''">
              <dt>Process Date</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each> 
      <xsl:for-each select="//dataqual/lineage/cloud">
          <xsl:if test="current()!=''">
              <dt>Cloud Cover</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
 
  
    <xsl:for-each select="//detailed/attr/attrlabl">
    <xsl:if test="current()!=''">
    <dt>Attribute Label</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr/attrlabl/attrdef">
    <xsl:if test="current()!=''">
    <dt>Attribute Definition</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr/attrlabl/attrdefs">
    <xsl:if test="current()!=''">
    <dt>Attribute Definition Source</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr/attrlabl/attrdomv/edom/edomv">
    <xsl:if test="current()!=''">
    <dt>Enumerated domain Value</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr/attrlabl/attrdomv/edom/edomvd">
    <xsl:if test="current()!=''">
        <dt>Enumerated domain Value Definition</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr/attrlabl/attrdomv/edom/edomvds">
    <xsl:if test="current()!=''">
        <dt>Enumerated domain Value Definition Source</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
          
          <xsl:for-each select="//detailed/attr/attrlabl/attrdomv/rdom/rdomain">
              <xsl:if test="current()!=''">
                  <dt>Range Domain</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>
          <xsl:for-each select="//detailed/attr/attrlabl/attrdomv/rdom/rdommax">
              <xsl:if test="current()!=''">
                  <dt>Range Domain Maximum</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>
          <xsl:for-each select="//detailed/attr/attrlabl/attrdomv/rdom/attrunit">
              <xsl:if test="current()!=''">
                  <dt>Attribute Unit of Measure</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>
          <xsl:for-each select="//detailed/attr/attrlabl/attrdomv/rdom/attrmres">
              <xsl:if test="current()!=''">
                  <dt>Attribute Measurement Resolution</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>
          <xsl:for-each select="//detailed/attr/attrlabl/attrdomv/codesetd/codesetn">
              <xsl:if test="current()!=''">
                  <dt>Codeset Name</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>
          <xsl:for-each select="//detailed/attr/attrlabl/attrdomv/codesetd/codesets">
              <xsl:if test="current()!=''">
                  <dt>Codeset Source</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>
          <xsl:for-each select="//detailed/attr/attrlabl/attrdomv/udom">
              <xsl:if test="current()!=''">
                  <dt>Unrepresentable Domain</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>
          
    <xsl:for-each select="//detailed/attr/begdatea">
    <xsl:if test="current()!=''">
    <dt>Beginning Date of Attribute Values</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
      <xsl:for-each select="//detailed/attr/enddatea">
          <xsl:if test="current()!=''">
              <dt>Ending Date of Attribute Values</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//detailed/attr/attrvai/attrva">
          <xsl:if test="current()!=''">
              <dt>Attribute Value Accuracy</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//detailed/attr/attrvai/attrvae">
          <xsl:if test="current()!=''">
              <dt>Attribute Value Accuracy Explanation</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//detailed/attr/attrmfrq">
          <xsl:if test="current()!=''">
              <dt>Attribute Measurement Frequency</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//overview/eaover">
          <xsl:if test="current()!=''">
              <dt>Entity and Attribute Overview</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//overview/eadetcit">
          <xsl:if test="current()!=''">
              <dt>Entity and Attribute Detail Citation</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>

      <xsl:for-each select="//distinfo/resdesc">
          <xsl:if test="current()!=''">
              <dt>Resource Description</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
          <xsl:for-each select="//distinfo/distrib">
              <xsl:if test="current()!=''">
                  <dt>Distributor</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>
      <xsl:for-each select="//distinfo/distlib">
          <xsl:if test="current()!=''">
              <dt>Distribution Liability</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
          <xsl:for-each select="//distinfo/networkr">
              <xsl:if test="current()!=''">
                  <dt>Network Resource Name</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>
          <xsl:for-each select="//distinfo/dialfile">
              <xsl:if test="current()!=''">
                  <dt>Dialup File Name</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>
          <xsl:for-each select="//distinfo/recden">
              <xsl:if test="current()!=''">
                  <dt>Recording Density</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>
          <xsl:for-each select="//distinfo/recdenu">
              <xsl:if test="current()!=''">
                  <dt>Recording Density Units</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>
          <xsl:for-each select="//distinfo/recfmt">
              <xsl:if test="current()!=''">
                  <dt>Recording Format</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>
          <xsl:for-each select="//distinfo/compat">
              <xsl:if test="current()!=''">
                  <dt>Compatability Information</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>
      <xsl:for-each select="//distinfo/custom">
          <xsl:if test="current()!=''">
              <dt>Custom Order Process</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//distinfo/techpreq">
          <xsl:if test="current()!=''">
              <dt>Technical Prerequisites</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
          <xsl:for-each select="//dialtel">
              <xsl:if test="current()!=''">
                  <dt>Dialup Telephone</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>
          <xsl:for-each select="//offmedia">
              <xsl:if test="current()!=''">
                  <dt>Offline Media</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>
    <xsl:for-each select="//metainfo/metd">
    <xsl:if test="current()!=''">
    <dt>Metadata Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metrd">
    <xsl:if test="current()!=''">
    <dt>Metadata Review Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metfrd">
    <xsl:if test="current()!=''">
    <dt>Metadata Future Review Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
 
    <xsl:for-each select="//metainfo/metstdn">
    <xsl:if test="current()!=''">
    <dt>Metadata Standard Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metstdv">
    <xsl:if test="current()!=''">
    <dt>Metadata Standard Version</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
          <xsl:for-each select="//metainfo/mettc">
              <xsl:if test="current()!=''">
                  <dt>Metadata Time Convention</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>
      <xsl:for-each select="//metainfo/metac">
          <xsl:if test="current()!=''">
              <dt>Metadata Access Constraints</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//metainfo/metuc">
          <xsl:if test="current()!=''">
              <dt>Metadata Use Constraints</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//metainfo/metsi/metscs">
          <xsl:if test="current()!=''">
              <dt>Metadata Security Classification System</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//metainfo/metsi/metsc">
          <xsl:if test="current()!=''">
              <dt>Metadata Security Classification</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//metainfo/metsi/metshd">
          <xsl:if test="current()!=''">
              <dt>Metadata Security Handling Description</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>


  </dl>
  </body>
  </html>
</xsl:template>

</xsl:stylesheet> 
