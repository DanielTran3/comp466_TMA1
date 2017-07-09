<?xml version="1.0"?>

<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:output method="html" doctype-system="about:legacy-compat" />
    <xsl:template match="/">
        <html>
            <head>
                <meta charset="utf-8" />
                <link rel="stylesheet" type="text/css" href="tma1_stylesheet.css" />
                <title>Resume</title>
            </head>
            <body>
                <xsl:apply-templates select="node()|@*" />
            </body>
        </html>
    </xsl:template>

    <xsl:template match="/myResume/section">
        <h1><xsl:value-of select="sectionHeader" /></h1>
        <xsl:apply-templates select="sectionInformation" />
    </xsl:template>

    <xsl:template match="sectionInformation">
        <xsl:if test="workplaceName">
            <h2><xsl:value-of select="workplaceName" /></h2>
        </xsl:if>
        <xsl:if test="workPosition">
            <h3><xsl:value-of select="workPosition" /></h3>
        </xsl:if>
        <ul>
            <xsl:apply-templates select="details"/>
        </ul>
    </xsl:template>

    <xsl:template match="details">
        <li>
            <xsl:value-of select="." />
        </li>
    </xsl:template>
</xsl:stylesheet>